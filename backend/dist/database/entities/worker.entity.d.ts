import { User } from './user.entity';
import { Job } from './job.entity';
export declare enum WorkerStatus {
    AVAILABLE = "available",
    ON_ROUTE = "on-route",
    ON_SITE = "on-site",
    OFFLINE = "offline"
}
export declare class Worker {
    id: string;
    userId: string;
    user: User;
    status: WorkerStatus;
    currentJobId: string;
    currentLocation: {
        lat: number;
        lng: number;
        timestamp: Date;
    };
    skills: string[];
    certifications: Record<string, any>;
    metadata: Record<string, any>;
    jobs: Job[];
    createdAt: Date;
    updatedAt: Date;
}
