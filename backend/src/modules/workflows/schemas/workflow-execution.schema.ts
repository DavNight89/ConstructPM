import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WorkflowExecutionDocument = WorkflowExecution & Document;

export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
  PARTIAL = 'partial', // Some actions succeeded, some failed
}

export interface ActionExecutionResult {
  actionType: string;
  status: 'success' | 'failed';
  message?: string;
  error?: string;
  executedAt: Date;
  duration?: number; // in milliseconds
}

@Schema({ timestamps: true, collection: 'workflow_executions' })
export class WorkflowExecution {
  @Prop({ type: Types.ObjectId, ref: 'Workflow', required: true })
  workflowId: Types.ObjectId;

  @Prop({ required: true })
  workflowName: string;

  @Prop({ type: String, enum: ExecutionStatus, default: ExecutionStatus.PENDING })
  status: ExecutionStatus;

  @Prop({ type: Object })
  triggerData: Record<string, any>; // Data that triggered the workflow

  @Prop({ type: [Object], default: [] })
  actionResults: ActionExecutionResult[];

  @Prop()
  startedAt: Date;

  @Prop()
  completedAt: Date;

  @Prop()
  duration: number; // in milliseconds

  @Prop()
  errorMessage: string;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  triggeredBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  organizationId: Types.ObjectId;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const WorkflowExecutionSchema = SchemaFactory.createForClass(WorkflowExecution);

// Indexes
WorkflowExecutionSchema.index({ workflowId: 1, createdAt: -1 });
WorkflowExecutionSchema.index({ organizationId: 1, status: 1 });
WorkflowExecutionSchema.index({ status: 1, createdAt: -1 });
WorkflowExecutionSchema.index({ createdAt: -1 });
