import { Document, Types } from 'mongoose';
export type WorkflowExecutionDocument = WorkflowExecution & Document;
export declare enum ExecutionStatus {
    PENDING = "pending",
    RUNNING = "running",
    SUCCESS = "success",
    FAILED = "failed",
    PARTIAL = "partial"
}
export interface ActionExecutionResult {
    actionType: string;
    status: 'success' | 'failed';
    message?: string;
    error?: string;
    executedAt: Date;
    duration?: number;
}
export declare class WorkflowExecution {
    workflowId: Types.ObjectId;
    workflowName: string;
    status: ExecutionStatus;
    triggerData: Record<string, any>;
    actionResults: ActionExecutionResult[];
    startedAt: Date;
    completedAt: Date;
    duration: number;
    errorMessage: string;
    metadata: Record<string, any>;
    triggeredBy: Types.ObjectId;
    organizationId: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const WorkflowExecutionSchema: import("mongoose").Schema<WorkflowExecution, import("mongoose").Model<WorkflowExecution, any, any, any, Document<unknown, any, WorkflowExecution, any, {}> & WorkflowExecution & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WorkflowExecution, Document<unknown, {}, import("mongoose").FlatRecord<WorkflowExecution>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<WorkflowExecution> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
