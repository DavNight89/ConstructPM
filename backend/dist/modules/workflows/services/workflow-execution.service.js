"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WorkflowExecutionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowExecutionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const workflow_schema_1 = require("../schemas/workflow.schema");
const workflow_execution_schema_1 = require("../schemas/workflow-execution.schema");
const condition_evaluator_service_1 = require("./condition-evaluator.service");
const email_action_handler_1 = require("./action-handlers/email-action.handler");
const sms_action_handler_1 = require("./action-handlers/sms-action.handler");
const database_action_handler_1 = require("./action-handlers/database-action.handler");
const webhook_action_handler_1 = require("./action-handlers/webhook-action.handler");
let WorkflowExecutionService = WorkflowExecutionService_1 = class WorkflowExecutionService {
    workflowModel;
    executionModel;
    conditionEvaluator;
    emailHandler;
    smsHandler;
    databaseHandler;
    webhookHandler;
    logger = new common_1.Logger(WorkflowExecutionService_1.name);
    constructor(workflowModel, executionModel, conditionEvaluator, emailHandler, smsHandler, databaseHandler, webhookHandler) {
        this.workflowModel = workflowModel;
        this.executionModel = executionModel;
        this.conditionEvaluator = conditionEvaluator;
        this.emailHandler = emailHandler;
        this.smsHandler = smsHandler;
        this.databaseHandler = databaseHandler;
        this.webhookHandler = webhookHandler;
    }
    async executeWorkflow(workflowId, triggerData, triggeredBy, metadata) {
        this.logger.log(`Executing workflow: ${workflowId}`);
        const workflow = await this.workflowModel.findById(workflowId);
        if (!workflow) {
            throw new common_1.NotFoundException(`Workflow ${workflowId} not found`);
        }
        if (!workflow.isActive) {
            throw new Error(`Workflow ${workflowId} is not active`);
        }
        const execution = new this.executionModel({
            workflowId: new mongoose_2.Types.ObjectId(workflowId),
            workflowName: workflow.name,
            status: workflow_execution_schema_1.ExecutionStatus.PENDING,
            triggerData,
            triggeredBy: triggeredBy ? new mongoose_2.Types.ObjectId(triggeredBy) : undefined,
            organizationId: workflow.organizationId,
            metadata,
            startedAt: new Date(),
        });
        await execution.save();
        this.executeWorkflowAsync(workflow, execution, triggerData);
        return execution;
    }
    async executeWorkflowAsync(workflow, execution, triggerData) {
        try {
            execution.status = workflow_execution_schema_1.ExecutionStatus.RUNNING;
            await execution.save();
            if (workflow.conditions && workflow.conditions.length > 0) {
                const conditionsPassed = this.conditionEvaluator.evaluateConditions(workflow.conditions, triggerData);
                if (!conditionsPassed) {
                    this.logger.log(`Workflow ${workflow._id} conditions not met, skipping execution`);
                    execution.status = workflow_execution_schema_1.ExecutionStatus.SUCCESS;
                    execution.completedAt = new Date();
                    execution.duration = execution.completedAt.getTime() - execution.startedAt.getTime();
                    execution.actionResults = [];
                    await execution.save();
                    return;
                }
            }
            const actionResults = [];
            let hasFailures = false;
            for (const action of workflow.actions) {
                if (action.conditions && action.conditions.length > 0) {
                    const actionConditionsPassed = this.conditionEvaluator.evaluateConditions(action.conditions, triggerData);
                    if (!actionConditionsPassed) {
                        this.logger.log(`Action ${action.type} conditions not met, skipping`);
                        continue;
                    }
                }
                const result = await this.executeAction(action.type, action.config, triggerData);
                actionResults.push(result);
                if (result.status === 'failed') {
                    hasFailures = true;
                }
            }
            execution.actionResults = actionResults;
            execution.completedAt = new Date();
            execution.duration =
                execution.completedAt.getTime() - execution.startedAt.getTime();
            if (actionResults.length === 0) {
                execution.status = workflow_execution_schema_1.ExecutionStatus.SUCCESS;
            }
            else if (hasFailures) {
                const allFailed = actionResults.every((r) => r.status === 'failed');
                execution.status = allFailed
                    ? workflow_execution_schema_1.ExecutionStatus.FAILED
                    : workflow_execution_schema_1.ExecutionStatus.PARTIAL;
            }
            else {
                execution.status = workflow_execution_schema_1.ExecutionStatus.SUCCESS;
            }
            await execution.save();
            this.logger.log(`Workflow ${workflow._id} execution completed with status: ${execution.status}`);
        }
        catch (error) {
            this.logger.error(`Workflow execution failed: ${error.message}`, error.stack);
            execution.status = workflow_execution_schema_1.ExecutionStatus.FAILED;
            execution.errorMessage = error.message;
            execution.completedAt = new Date();
            execution.duration =
                execution.completedAt.getTime() - execution.startedAt.getTime();
            await execution.save();
        }
    }
    async executeAction(type, config, triggerData) {
        this.logger.log(`Executing action: ${type}`);
        try {
            switch (type) {
                case workflow_schema_1.ActionType.SEND_EMAIL:
                    return await this.emailHandler.execute(config, triggerData);
                case workflow_schema_1.ActionType.SEND_SMS:
                    return await this.smsHandler.execute(config, triggerData);
                case workflow_schema_1.ActionType.UPDATE_DATABASE:
                case workflow_schema_1.ActionType.CREATE_RECORD:
                    return await this.databaseHandler.execute(config, triggerData);
                case workflow_schema_1.ActionType.WEBHOOK:
                    return await this.webhookHandler.execute(config, triggerData);
                case workflow_schema_1.ActionType.ASSIGN_TASK:
                case workflow_schema_1.ActionType.UPDATE_STATUS:
                    return {
                        actionType: type,
                        status: 'success',
                        message: `Action ${type} executed (not yet fully implemented)`,
                        executedAt: new Date(),
                    };
                default:
                    throw new Error(`Unknown action type: ${type}`);
            }
        }
        catch (error) {
            this.logger.error(`Action ${type} failed: ${error.message}`);
            return {
                actionType: type,
                status: 'failed',
                error: error.message,
                executedAt: new Date(),
            };
        }
    }
    async getExecutionHistory(workflowId, limit = 50) {
        return this.executionModel
            .find({ workflowId: new mongoose_2.Types.ObjectId(workflowId) })
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }
    async getExecutionById(executionId) {
        const execution = await this.executionModel.findById(executionId);
        if (!execution) {
            throw new common_1.NotFoundException(`Execution ${executionId} not found`);
        }
        return execution;
    }
    async getAllExecutions(filters, limit = 100) {
        const query = {};
        if (filters.status) {
            query.status = filters.status;
        }
        if (filters.workflowId) {
            query.workflowId = new mongoose_2.Types.ObjectId(filters.workflowId);
        }
        if (filters.organizationId) {
            query.organizationId = new mongoose_2.Types.ObjectId(filters.organizationId);
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
};
exports.WorkflowExecutionService = WorkflowExecutionService;
exports.WorkflowExecutionService = WorkflowExecutionService = WorkflowExecutionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(workflow_schema_1.Workflow.name)),
    __param(1, (0, mongoose_1.InjectModel)(workflow_execution_schema_1.WorkflowExecution.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        condition_evaluator_service_1.ConditionEvaluatorService,
        email_action_handler_1.EmailActionHandler,
        sms_action_handler_1.SmsActionHandler,
        database_action_handler_1.DatabaseActionHandler,
        webhook_action_handler_1.WebhookActionHandler])
], WorkflowExecutionService);
//# sourceMappingURL=workflow-execution.service.js.map