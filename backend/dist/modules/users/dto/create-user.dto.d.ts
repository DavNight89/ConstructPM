import { UserRole } from '../../../database/entities/user.entity';
export declare class CreateUserDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: UserRole;
    phone?: string;
    avatarUrl?: string;
}
