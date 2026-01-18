import { Repository } from 'typeorm';
import { User, UserStatus } from '../../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(filters?: {
        role?: string;
        status?: UserStatus;
    }): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
    changePassword(id: string, newPassword: string): Promise<void>;
    updateStatus(id: string, status: UserStatus): Promise<User>;
    getStatistics(): Promise<any>;
}
