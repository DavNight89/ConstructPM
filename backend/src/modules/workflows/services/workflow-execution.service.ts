import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Workflow,
  WorkflowDocument,
  ActionType,
} from '../schemas/workflow.schema';
import {
  WorkflowExecution,
  WorkflowExecutionDocument,
  ExecutionStatus,
  ActionExecutionResult,
} from '../schemas/workflow-execution.schema';
import { ConditionEvaluatorService } from './condition-evaluator.service';
import { EmailActionHandler } from './action-handlers/email-action.handler';
import { SmsActionHandler } from './action-handlers/sms-action.handler';
import { DatabaseActionHandler } from './action-handlers/database-action.handler';
import { WebhookActionHandler } from './action-handlers/webhook-action.handler';

@Injectable()
export class WorkflowExecutionService {
  private readonly logger = new Logger(WorkflowExecutionService.name);

  constructor(
    @InjectModel(Workflow.name)
    private workflowModel: Model<WorkflowDocument>,
    @InjectModel(WorkflowExecution.name)
    private executionModel: Model<WorkflowExecutionDocument>,
    private conditionEvaluator: ConditionEvaluatorService,
    private emailHandler: EmailActionHandler,
    private smsHandler: SmsActionHandler,
    private databaseHandler: DatabaseActionHandler,
    private webhookHandler: WebhookActionHandler,
  ) {}

  /**
   * Execute a workflow by ID
   */
  async executeWorkflow(
    workflowId: string,
    triggerData: Record<string, any>,
    triggeredBy?: string,
    metadata?: Record<string, any>,
  ): Promise<WorkflowExecutionDocument> {
    this.logger.log(`Executing workflow: ${workflowId}`);

    // Find workflow
    const workflow = await this.workflowModel.findById(workflowId);
    if (!workflow) {
      throw new NotFoundException(`Workflow ${workflowId} not found`);
    }

    if (!workflow.isActive) {
      throw new Error(`Workflow ${workflowId} is not active`);
    }

    // Create execution record
    const execution = new this.executionModel({
      workflowId: new Types.ObjectId(workflowId),
      workflowName: workflow.name,
      status: ExecutionStatus.PENDING,
      triggerData,
      triggeredBy: triggeredBy ? new Types.ObjectId(triggeredBy) : undefined,
      organizationId: workflow.organizationId,
      metadata,
      startedAt: new Date(),
    });

    await execution.save();

    // Execute workflow asynchronously
    this.executeWorkflowAsync(workflow, execution, triggerData);

    return execution;
  }

  /**
   * Execute workflow asynchronously
   */
  private async executeWorkflowAsync(
    workflow: WorkflowDocument,
    execution: WorkflowExecutionDocument,
    triggerData: Record<string, any>,
  ): Promise<void> {
    try {
      // Update status to running
      execution.status = ExecutionStatus.RUNNING;
      await execution.save();

      // Evaluate workflow-level conditions
      if (workflow.conditions && workflow.conditions.length > 0) {
        const conditionsPassed = this.conditionEvaluator.evaluateConditions(
          workflow.conditions,
          triggerData,
        );

        if (!conditionsPassed) {
          this.logger.log(
            `Workflow ${workflow._id} conditions not met, skipping execution`,
          );
          execution.status = ExecutionStatus.SUCCESS;
          execution.completedAt = new Date();
          execution.duration = execution.completedAt.getTime() - execution.startedAt.getTime();
          execution.actionResults = [];
          await execution.save();
          return;
        }
      }

      // Execute actions
      const actionResults: ActionExecutionResult[] = [];
      let hasFailures = false;

      for (const action of workflow.actions) {
        // Check action-specific conditions
        if (action.conditions && action.conditions.length > 0) {
          const actionConditionsPassed =
            this.conditionEvaluator.evaluateConditions(
              action.conditions,
              triggerData,
            );

          if (!actionConditionsPassed) {
            this.logger.log(
              `Action ${action.type} conditions not met, skipping`,
            );
            continue;
          }
        }

        // Execute action
        const result = await this.executeAction(action.type, action.config, triggerData);
        actionResults.push(result);

        if (result.status === 'failed') {
          hasFailures = true;
        }
      }

      // Update execution with results
      execution.actionResults = actionResults;
      execution.completedAt = new Date();
      execution.duration =
        execution.completedAt.getTime() - execution.startedAt.getTime();

      // Determine final status
      if (actionResults.length === 0) {
        execution.status = ExecutionStatus.SUCCESS;
      } else if (hasFailures) {
        const allFailed = actionResults.every((r) => r.status === 'failed');
        execution.status = allFailed
          ? ExecutionStatus.FAILED
          : ExecutionStatus.PARTIAL;
      } else {
        execution.status = ExecutionStatus.SUCCESS;
      }

      await execution.save();

      this.logger.log(
        `Workflow ${workflow._id} execution completed with status: ${execution.status}`,
      );
    } catch (error) {
      this.logger.error(`Workflow execution failed: ${error.message}`, error.stack);
      execution.status = ExecutionStatus.FAILED;
      execution.errorMessage = error.message;
      execution.completedAt = new Date();
      execution.duration =
        execution.completedAt.getTime() - execution.startedAt.getTime();
      await execution.save();
    }
  }

  /**
   * Execute a single action
   */
  private async executeAction(
    type: ActionType,
    config: Record<string, any>,
    triggerData: Record<string, any>,
  ): Promise<ActionExecutionResult> {
    this.logger.log(`Executing action: ${type}`);

    try {
      switch (type) {
        case ActionType.SEND_EMAIL:
          return await this.emailHandler.execute(config as any, triggerData);

        case ActionType.SEND_SMS:
          return await this.smsHandler.execute(config as any, triggerData);

        case ActionType.UPDATE_DATABASE:
        case ActionType.CREATE_RECORD:
          return await this.databaseHandler.execute(config as any, triggerData);

        case ActionType.WEBHOOK:
          return await this.webhookHandler.execute(config as any, triggerData);

        case ActionType.ASSIGN_TASK:
        case ActionType.UPDATE_STATUS:
          // TODO: Implement these action types
          return {
            actionType: type,
            status: 'success',
            message: `Action ${type} executed (not yet fully implemented)`,
            executedAt: new Date(),
          };

        default:
          throw new Error(`Unknown action type: ${type}`);
      }
    } catch (error) {
      this.logger.error(`Action ${type} failed: ${error.message}`);
      return {
        actionType: type,
        status: 'failed',
        error: error.message,
        executedAt: new Date(),
      };
    }
  }

  /**
   * Get execution history for a workflow
   */
  async getExecutionHistory(
    workflowId: string,
    limit = 50,
  ): Promise<WorkflowExecutionDocument[]> {
    return this.executionModel
      .find({ workflowId: new Types.ObjectId(workflowId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  /**
   * Get execution by ID
   */
  async getExecutionById(executionId: string): Promise<WorkflowExecutionDocument> {
    const execution = await this.executionModel.findById(executionId);
    if (!execution) {
      throw new NotFoundException(`Execution ${executionId} not found`);
    }
    return execution;
  }

  /**
   * Get all executions with filters
   */
  async getAllExecutions(
    filters: {
      status?: ExecutionStatus;
      workflowId?: string;
      organizationId?: string;
      startDate?: Date;
      endDate?: Date;
    },
    limit = 100,
  ): Promise<WorkflowExecutionDocument[]> {
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.workflowId) {
      query.workflowId = new Types.ObjectId(filters.workflowId);
    }
    if (filters.organizationId) {
      query.organizationId = new Types.ObjectId(filters.organizationId);
    }
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.createdAt.$lte = filters.endDate;
      }
    }

    return this.executionModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}
