import { Project } from './project.entity';
import { Worker } from './worker.entity';
export declare enum JobStatus {
    PENDING = "pending",
    ASSIGNED = "assigned",
    IN_PROGRESS = "in-progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum JobPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}
export declare class Job {
    id: string;
    jobNumber: string;
    projectId: string;
    project: Project;
    assignedWorkerId: string;
    assignedWorker: Worker;
    title: string;
    description: string;
    status: JobStatus;
    priority: JobPriority;
    scheduledTime: Date;
    startedAt: Date;
    completedAt: Date;
    location: {
        address: string;
        lat: number;
        lng: number;
    };
    estimatedDuration: number;
    actualDuration: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
