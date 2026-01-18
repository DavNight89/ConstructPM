import { Document } from 'mongoose';
export type SubmissionDocument = Submission & Document;
export declare enum SubmissionStatus {
    SUBMITTED = "submitted",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class Submission {
    formId: string;
    formVersion: number;
    projectId: string;
    workerId: string;
    jobId: string;
    data: Record<string, any>;
    metadata: {
        submittedAt: Date;
        gpsLocation?: {
            lat: number;
            lng: number;
        };
        signature?: string;
        photos?: string[];
        ipAddress?: string;
        deviceInfo?: Record<string, any>;
    };
    status: SubmissionStatus;
    approvals: Array<{
        userId: string;
        action: string;
        comment?: string;
        timestamp: Date;
    }>;
}
export declare const SubmissionSchema: import("mongoose").Schema<Submission, import("mongoose").Model<Submission, any, any, any, Document<unknown, any, Submission, any, {}> & Submission & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Submission, Document<unknown, {}, import("mongoose").FlatRecord<Submission>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Submission> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
