import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from '../../database/entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("../../database/entities/user.entity").User>;
    findAll(role?: string, status?: UserStatus): Promise<import("../../database/entities/user.entity").User[]>;
    getStatistics(): Promise<any>;
    findOne(id: string): Promise<import("../../database/entities/user.entity").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("../../database/entities/user.entity").User>;
    remove(id: string): Promise<{
        message: string;
    }>;
    hardDelete(id: string): Promise<{
        message: string;
    }>;
    updateStatus(id: string, status: UserStatus): Promise<import("../../database/entities/user.entity").User>;
    changePassword(id: string, newPassword: string): Promise<{
        message: string;
    }>;
}
