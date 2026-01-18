import { Model } from 'mongoose';
import { WorkflowDocument } from './schemas/workflow.schema';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
export declare class WorkflowsService {
    private workflowModel;
    constructor(workflowModel: Model<WorkflowDocument>);
    create(createWorkflowDto: CreateWorkflowDto, userId: string, organizationId: string): Promise<WorkflowDocument>;
    findAll(filters?: {
        organizationId?: string;
        isActive?: boolean;
        triggerType?: string;
    }): Promise<WorkflowDocument[]>;
    findOne(id: string): Promise<WorkflowDocument>;
    update(id: string, updateWorkflowDto: UpdateWorkflowDto): Promise<WorkflowDocument>;
    remove(id: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
    toggleActive(id: string): Promise<WorkflowDocument>;
    findByTriggerType(triggerType: string): Promise<WorkflowDocument[]>;
    findWorkflowsForForm(formId: string): Promise<WorkflowDocument[]>;
    private validateWorkflow;
    getStatistics(organizationId?: string): Promise<any>;
}
