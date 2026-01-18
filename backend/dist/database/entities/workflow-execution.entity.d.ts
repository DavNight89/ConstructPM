import { Workflow } from './workflow.entity';
export declare enum ExecutionStatus {
    PENDING = "pending",
    RUNNING = "running",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare class WorkflowExecution {
    id: string;
    workflowId: string;
    workflow: Workflow;
    triggerData: Record<string, any>;
    executionStatus: ExecutionStatus;
    startedAt: Date;
    completedAt: Date;
    errorMessage: string;
    logs: Record<string, any>[];
    createdAt: Date;
}
