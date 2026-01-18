import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    login(loginDto: LoginDto): Promise<{
        requiresMfa: boolean;
        message: string;
    } | {
        accessToken: string;
        refreshToken: string;
        user: any;
        requiresMfa?: undefined;
        message?: undefined;
    }>;
    enableMfa(userId: string): Promise<{
        secret: string;
        qrCode: string | undefined;
    }>;
    verifyAndEnableMfa(userId: string, token: string): Promise<{
        message: string;
    }>;
    refreshToken(userId: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    private generateTokens;
    private sanitizeUser;
    validateUser(userId: string): Promise<User | null>;
}
