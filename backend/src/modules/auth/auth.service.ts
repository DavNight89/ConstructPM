import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { User } from '../../database/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, role } = registerDto;

    // Check if user exists
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = this.usersRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
      role,
    });

    await this.usersRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password, mfaToken } = loginDto;

    // Find user with password
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'passwordHash', 'role', 'status', 'mfaEnabled', 'mfaSecret'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if MFA is enabled
    if (user.mfaEnabled) {
      if (!mfaToken) {
        return {
          requiresMfa: true,
          message: 'MFA token required',
        };
      }

      const isValidToken = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: mfaToken,
        window: 2,
      });

      if (!isValidToken) {
        throw new UnauthorizedException('Invalid MFA token');
      }
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async enableMfa(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate MFA secret
    const secret = speakeasy.generateSecret({
      name: `ConstructPM (${user.email})`,
      issuer: 'ConstructPM',
    });

    // Save secret
    user.mfaSecret = secret.base32;
    await this.usersRepository.save(user);

    return {
      secret: secret.base32,
      qrCode: secret.otpauth_url,
    };
  }

  async verifyAndEnableMfa(userId: string, token: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'mfaSecret'],
    });

    if (!user || !user.mfaSecret) {
      throw new UnauthorizedException('MFA setup not initiated');
    }

    const isValid = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: token,
      window: 2,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid MFA token');
    }

    user.mfaEnabled = true;
    await this.usersRepository.save(user);

    return { message: 'MFA enabled successfully' };
  }

  async refreshToken(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.generateTokens(user);
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private sanitizeUser(user: User) {
    const { passwordHash, mfaSecret, ...sanitized } = user as any;
    return sanitized;
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }
}
