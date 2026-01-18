import { Model } from 'mongoose';
import { WorkflowDocument } from '../schemas/workflow.schema';
import { WorkflowExecutionDocument, ExecutionStatus } from '../schemas/workflow-execution.schema';
import { ConditionEvaluatorService } from './condition-evaluator.service';
import { EmailActionHandler } from './action-handlers/email-action.handler';
import { SmsActionHandler } from './action-handlers/sms-action.handler';
import { DatabaseActionHandler } from './action-handlers/database-action.handler';
import { WebhookActionHandler } from './action-handlers/webhook-action.handler';
export declare class WorkflowExecutionService {
    private workflowModel;
    private executionModel;
    private conditionEvaluator;
    private emailHandler;
    private smsHandler;
    private databaseHandler;
    private webhookHandler;
    private readonly logger;
    constructor(workflowModel: Model<WorkflowDocument>, executionModel: Model<WorkflowExecutionDocument>, conditionEvaluator: ConditionEvaluatorService, emailHandler: EmailActionHandler, smsHandler: SmsActionHandler, databaseHandler: DatabaseActionHandler, webhookHandler: WebhookActionHandler);
    executeWorkflow(workflowId: string, triggerData: Record<string, any>, triggeredBy?: string, metadata?: Record<string, any>): Promise<WorkflowExecutionDocument>;
    private executeWorkflowAsync;
    private executeAction;
    getExecutionHistory(workflowId: string, limit?: number): Promise<WorkflowExecutionDocument[]>;
    getExecutionById(executionId: string): Promise<WorkflowExecutionDocument>;
    getAllExecutions(filters: {
        status?: ExecutionStatus;
        workflowId?: string;
        organizationId?: string;
        startDate?: Date;
        endDate?: Date;
    }, limit?: number): Promise<WorkflowExecutionDocument[]>;
}
