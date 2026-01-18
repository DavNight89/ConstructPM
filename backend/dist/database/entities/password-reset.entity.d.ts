import { User } from './user.entity';
export declare class PasswordReset {
    id: string;
    userId: string;
    user: User;
    token: string;
    expiresAt: Date;
    used: boolean;
    createdAt: Date;
}
