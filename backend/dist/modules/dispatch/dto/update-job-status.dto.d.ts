import { JobStatus } from '../../../database/entities/job.entity';
export declare class UpdateJobStatusDto {
    status: JobStatus;
    notes?: string;
}
