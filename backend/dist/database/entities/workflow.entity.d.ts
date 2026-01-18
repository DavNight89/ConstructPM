import { User } from './user.entity';
import { WorkflowExecution } from './workflow-execution.entity';
export declare enum WorkflowStatus {
    ACTIVE = "active",
    PAUSED = "paused",
    ARCHIVED = "archived"
}
export declare class Workflow {
    id: string;
    name: string;
    description: string;
    status: WorkflowStatus;
    triggerType: string;
    triggerConfig: Record<string, any>;
    conditions: Record<string, any>[];
    actions: Record<string, any>[];
    executionCount: number;
    lastExecution: Date;
    createdBy: string;
    creator: User;
    executions: WorkflowExecution[];
    createdAt: Date;
    updatedAt: Date;
}
