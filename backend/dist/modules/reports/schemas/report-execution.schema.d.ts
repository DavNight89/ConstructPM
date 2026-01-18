import { Document, Types } from 'mongoose';
import { ReportFormat } from './report.schema';
export type ReportExecutionDocument = ReportExecution & Document;
export declare enum ExecutionStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed"
}
export interface GeneratedFile {
    format: ReportFormat;
    filename: string;
    path: string;
    size: number;
    url?: string;
}
export declare class ReportExecution {
    reportId: Types.ObjectId;
    reportName: string;
    status: ExecutionStatus;
    startedAt: Date;
    completedAt: Date;
    duration: number;
    generatedFiles: GeneratedFile[];
    recordCount: number;
    parameters: Record<string, any>;
    errorMessage: string;
    errorStack: string;
    executedBy: Types.ObjectId;
    organizationId: Types.ObjectId;
    isScheduled: boolean;
    metadata: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const ReportExecutionSchema: import("mongoose").Schema<ReportExecution, import("mongoose").Model<ReportExecution, any, any, any, Document<unknown, any, ReportExecution, any, {}> & ReportExecution & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ReportExecution, Document<unknown, {}, import("mongoose").FlatRecord<ReportExecution>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ReportExecution> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
