import { SubmissionStatus } from '../schemas/submission.schema';
export declare class FilterSubmissionDto {
    formId?: string;
    projectId?: string;
    workerId?: string;
    jobId?: string;
    status?: SubmissionStatus;
    page?: number;
    limit?: number;
}
