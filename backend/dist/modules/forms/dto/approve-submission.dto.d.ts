import { SubmissionStatus } from '../schemas/submission.schema';
export declare class ApproveSubmissionDto {
    status: SubmissionStatus;
    userId: string;
    comment?: string;
}
