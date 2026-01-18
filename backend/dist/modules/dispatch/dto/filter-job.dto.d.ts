import { JobStatus, JobPriority } from '../../../database/entities/job.entity';
export declare class FilterJobDto {
    status?: JobStatus;
    priority?: JobPriority;
    projectId?: string;
    workerId?: string;
    search?: string;
    page?: number;
    limit?: number;
}
