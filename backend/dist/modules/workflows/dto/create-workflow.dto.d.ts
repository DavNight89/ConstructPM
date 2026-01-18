import { WorkflowCondition, WorkflowAction } from '../schemas/workflow.schema';
import type { WorkflowTrigger } from '../schemas/workflow.schema';
export declare class CreateWorkflowDto {
    name: string;
    description?: string;
    trigger: WorkflowTrigger;
    actions: WorkflowAction[];
    conditions?: WorkflowCondition[];
    isActive?: boolean;
    metadata?: Record<string, any>;
}
