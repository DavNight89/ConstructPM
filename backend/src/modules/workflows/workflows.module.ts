import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';
import { WorkflowExecutionService } from './services/workflow-execution.service';
import { ConditionEvaluatorService } from './services/condition-evaluator.service';
import { EmailActionHandler } from './services/action-handlers/email-action.handler';
import { SmsActionHandler } from './services/action-handlers/sms-action.handler';
import { DatabaseActionHandler } from './services/action-handlers/database-action.handler';
import { WebhookActionHandler } from './services/action-handlers/webhook-action.handler';
import { Workflow, WorkflowSchema } from './schemas/workflow.schema';
import {
  WorkflowExecution,
  WorkflowExecutionSchema,
} from './schemas/workflow-execution.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workflow.name, schema: WorkflowSchema },
      { name: WorkflowExecution.name, schema: WorkflowExecutionSchema },
    ]),
  ],
  controllers: [WorkflowsController],
  providers: [
    WorkflowsService,
    WorkflowExecutionService,
    ConditionEvaluatorService,
    EmailActionHandler,
    SmsActionHandler,
    DatabaseActionHandler,
    WebhookActionHandler,
  ],
  exports: [WorkflowsService, WorkflowExecutionService],
})
export class WorkflowsModule {}
