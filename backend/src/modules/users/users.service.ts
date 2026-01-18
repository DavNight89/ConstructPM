import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from '../../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Create a new user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existing = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);

    const user = this.usersRepository.create({
      ...createUserDto,
      passwordHash,
    });

    return this.usersRepository.save(user);
  }

  /**
   * Find all users
   */
  async findAll(filters?: {
    role?: string;
    status?: UserStatus;
  }): Promise<User[]> {
    const query = this.usersRepository.createQueryBuilder('user');

    if (filters?.role) {
      query.andWhere('user.role = :role', { role: filters.role });
    }

    if (filters?.status) {
      query.andWhere('user.status = :status', { status: filters.status });
    }

    return query.getMany();
  }

  /**
   * Find one user by ID
   */
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['managedProjects'],
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'passwordHash', 'role', 'status', 'mfaEnabled'],
    });
  }

  /**
   * Update user
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Check email uniqueness if being updated
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existing) {
        throw new ConflictException('Email already exists');
      }
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  /**
   * Delete user (soft delete by setting status to inactive)
   */
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    user.status = UserStatus.INACTIVE;
    await this.usersRepository.save(user);
  }

  /**
   * Hard delete user
   */
  async hardDelete(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }

  /**
   * Change user password
   */
  async changePassword(id: string, newPassword: string): Promise<void> {
    const user = await this.findOne(id);

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(newPassword, salt);

    user.passwordHash = passwordHash;
    await this.usersRepository.save(user);
  }

  /**
   * Update user status
   */
  async updateStatus(id: string, status: UserStatus): Promise<User> {
    const user = await this.findOne(id);
    user.status = status;
    return this.usersRepository.save(user);
  }

  /**
   * Get user statistics
   */
  async getStatistics(): Promise<any> {
    const total = await this.usersRepository.count();

    const byRole = await this.usersRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    const byStatus = await this.usersRepository
      .createQueryBuilder('user')
      .select('user.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.status')
      .getRawMany();

    const active = await this.usersRepository.count({
      where: { status: UserStatus.ACTIVE },
    });

    return {
      total,
      active,
      inactive: total - active,
      byRole,
      byStatus,
    };
  }
}
