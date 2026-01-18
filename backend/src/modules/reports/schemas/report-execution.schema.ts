import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ReportFormat } from './report.schema';

export type ReportExecutionDocument = ReportExecution & Document;

export enum ExecutionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface GeneratedFile {
  format: ReportFormat;
  filename: string;
  path: string;
  size: number; // bytes
  url?: string;
}

@Schema({ timestamps: true, collection: 'report_executions' })
export class ReportExecution {
  @Prop({ type: Types.ObjectId, ref: 'Report', required: true })
  reportId: Types.ObjectId;

  @Prop({ required: true })
  reportName: string;

  @Prop({ type: String, enum: ExecutionStatus, default: ExecutionStatus.PENDING })
  status: ExecutionStatus;

  @Prop()
  startedAt: Date;

  @Prop()
  completedAt: Date;

  @Prop()
  duration: number; // milliseconds

  @Prop({ type: [Object] })
  generatedFiles: GeneratedFile[];

  @Prop()
  recordCount: number;

  @Prop({ type: Object })
  parameters: Record<string, any>; // Runtime parameters

  @Prop()
  errorMessage: string;

  @Prop()
  errorStack: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  executedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  organizationId: Types.ObjectId;

  @Prop({ default: false })
  isScheduled: boolean;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ReportExecutionSchema = SchemaFactory.createForClass(ReportExecution);

// Indexes
ReportExecutionSchema.index({ reportId: 1, createdAt: -1 });
ReportExecutionSchema.index({ organizationId: 1, status: 1 });
ReportExecutionSchema.index({ status: 1, createdAt: -1 });
ReportExecutionSchema.index({ executedBy: 1, createdAt: -1 });
