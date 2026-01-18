import { WorkflowsService } from './workflows.service';
import { WorkflowExecutionService } from './services/workflow-execution.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { ExecuteWorkflowDto } from './dto/execute-workflow.dto';
import { ExecutionStatus } from './schemas/workflow-execution.schema';
export declare class WorkflowsController {
    private readonly workflowsService;
    private readonly executionService;
    constructor(workflowsService: WorkflowsService, executionService: WorkflowExecutionService);
    create(createWorkflowDto: CreateWorkflowDto): Promise<import("./schemas/workflow.schema").WorkflowDocument>;
    findAll(organizationId?: string, isActive?: boolean, triggerType?: string): Promise<import("./schemas/workflow.schema").WorkflowDocument[]>;
    getStatistics(organizationId?: string): Promise<any>;
    findOne(id: string): Promise<import("./schemas/workflow.schema").WorkflowDocument>;
    update(id: string, updateWorkflowDto: UpdateWorkflowDto): Promise<import("./schemas/workflow.schema").WorkflowDocument>;
    remove(id: string): Promise<{
        message: string;
    }>;
    hardDelete(id: string): Promise<{
        message: string;
    }>;
    toggleActive(id: string): Promise<import("./schemas/workflow.schema").WorkflowDocument>;
    execute(id: string, executeDto: ExecuteWorkflowDto): Promise<import("./schemas/workflow-execution.schema").WorkflowExecutionDocument>;
    getExecutionHistory(id: string, limit?: number): Promise<import("./schemas/workflow-execution.schema").WorkflowExecutionDocument[]>;
    getExecutionById(executionId: string): Promise<import("./schemas/workflow-execution.schema").WorkflowExecutionDocument>;
    getAllExecutions(status?: ExecutionStatus, workflowId?: string, organizationId?: string, startDate?: string, endDate?: string, limit?: number): Promise<import("./schemas/workflow-execution.schema").WorkflowExecutionDocument[]>;
}
