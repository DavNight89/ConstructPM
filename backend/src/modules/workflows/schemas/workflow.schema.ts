import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WorkflowDocument = Workflow & Document;

export enum TriggerType {
  FORM_SUBMIT = 'form_submit',
  STATUS_CHANGE = 'status_change',
  SCHEDULE = 'schedule',
  MANUAL = 'manual',
  WEBHOOK = 'webhook',
}

export enum ActionType {
  SEND_EMAIL = 'send_email',
  SEND_SMS = 'send_sms',
  UPDATE_DATABASE = 'update_database',
  CREATE_RECORD = 'create_record',
  WEBHOOK = 'webhook',
  ASSIGN_TASK = 'assign_task',
  UPDATE_STATUS = 'update_status',
}

export enum ConditionOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  IS_EMPTY = 'is_empty',
  IS_NOT_EMPTY = 'is_not_empty',
}

export interface WorkflowCondition {
  field: string;
  operator: ConditionOperator;
  value: any;
  logicalOperator?: 'AND' | 'OR'; // For multiple conditions
}

export interface WorkflowAction {
  type: ActionType;
  config: Record<string, any>; // Action-specific configuration
  conditions?: WorkflowCondition[]; // Optional conditions for this action
}

export interface WorkflowTrigger {
  type: TriggerType;
  config: Record<string, any>; // Trigger-specific configuration
}

@Schema({ timestamps: true, collection: 'workflows' })
export class Workflow {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Object, required: true })
  trigger: WorkflowTrigger;

  @Prop({ type: [Object], required: true })
  actions: WorkflowAction[];

  @Prop({ type: [Object] })
  conditions: WorkflowCondition[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  organizationId: Types.ObjectId;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const WorkflowSchema = SchemaFactory.createForClass(Workflow);

// Indexes
WorkflowSchema.index({ organizationId: 1, isActive: 1 });
WorkflowSchema.index({ 'trigger.type': 1 });
WorkflowSchema.index({ createdAt: -1 });
