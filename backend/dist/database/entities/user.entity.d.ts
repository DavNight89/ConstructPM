import { Project } from './project.entity';
export declare enum UserRole {
    ADMIN = "admin",
    MANAGER = "manager",
    WORKER = "worker",
    CLIENT = "client"
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended"
}
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phone: string;
    avatarUrl: string;
    mfaEnabled: boolean;
    mfaSecret: string;
    status: UserStatus;
    managedProjects: Project[];
    createdAt: Date;
    updatedAt: Date;
}
