import { User } from './user.entity';
import { Job } from './job.entity';
export declare enum ProjectStatus {
    PLANNING = "planning",
    IN_PROGRESS = "in-progress",
    COMPLETED = "completed",
    ON_HOLD = "on-hold"
}
export declare enum ProjectPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}
export declare class Project {
    id: string;
    name: string;
    description: string;
    clientId: string;
    client: User;
    managerId: string;
    manager: User;
    status: ProjectStatus;
    progress: number;
    budget: number;
    spent: number;
    startDate: Date;
    endDate: Date;
    location: {
        address: string;
        lat: number;
        lng: number;
    };
    priority: ProjectPriority;
    metadata: Record<string, any>;
    jobs: Job[];
    createdAt: Date;
    updatedAt: Date;
}
