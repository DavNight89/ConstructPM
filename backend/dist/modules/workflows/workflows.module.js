"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const workflows_controller_1 = require("./workflows.controller");
const workflows_service_1 = require("./workflows.service");
const workflow_execution_service_1 = require("./services/workflow-execution.service");
const condition_evaluator_service_1 = require("./services/condition-evaluator.service");
const email_action_handler_1 = require("./services/action-handlers/email-action.handler");
const sms_action_handler_1 = require("./services/action-handlers/sms-action.handler");
const database_action_handler_1 = require("./services/action-handlers/database-action.handler");
const webhook_action_handler_1 = require("./services/action-handlers/webhook-action.handler");
const workflow_schema_1 = require("./schemas/workflow.schema");
const workflow_execution_schema_1 = require("./schemas/workflow-execution.schema");
let WorkflowsModule = class WorkflowsModule {
};
exports.WorkflowsModule = WorkflowsModule;
exports.WorkflowsModule = WorkflowsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: workflow_schema_1.Workflow.name, schema: workflow_schema_1.WorkflowSchema },
                { name: workflow_execution_schema_1.WorkflowExecution.name, schema: workflow_execution_schema_1.WorkflowExecutionSchema },
            ]),
        ],
        controllers: [workflows_controller_1.WorkflowsController],
        providers: [
            workflows_service_1.WorkflowsService,
            workflow_execution_service_1.WorkflowExecutionService,
            condition_evaluator_service_1.ConditionEvaluatorService,
            email_action_handler_1.EmailActionHandler,
            sms_action_handler_1.SmsActionHandler,
            database_action_handler_1.DatabaseActionHandler,
            webhook_action_handler_1.WebhookActionHandler,
        ],
        exports: [workflows_service_1.WorkflowsService, workflow_execution_service_1.WorkflowExecutionService],
    })
], WorkflowsModule);
//# sourceMappingURL=workflows.module.js.map