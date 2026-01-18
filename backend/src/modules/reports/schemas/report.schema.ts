import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReportDocument = Report & Document;

export enum ReportType {
  FORM_SUBMISSIONS = 'form_submissions',
  PROJECT_SUMMARY = 'project_summary',
  WORKER_ACTIVITY = 'worker_activity',
  TIME_TRACKING = 'time_tracking',
  FINANCIAL = 'financial',
  CUSTOM = 'custom',
}

export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json',
}

export enum ReportSchedule {
  ONCE = 'once',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
}

export enum ReportStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export interface ReportFilter {
  field: string;
  operator: string;
  value: any;
}

export interface ReportColumn {
  field: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  format?: string;
  aggregate?: 'sum' | 'avg' | 'min' | 'max' | 'count';
}

export interface ReportScheduleConfig {
  frequency: ReportSchedule;
  time?: string; // HH:mm format
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  recipients: string[]; // Email addresses
  formats: ReportFormat[];
}

@Schema({ timestamps: true, collection: 'reports' })
export class Report {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: String, enum: ReportType, required: true })
  type: ReportType;

  @Prop({ type: String, enum: ReportStatus, default: ReportStatus.DRAFT })
  status: ReportStatus;

  @Prop({ type: [String], enum: ReportFormat, default: [ReportFormat.PDF] })
  formats: ReportFormat[];

  @Prop({ type: Object })
  dataSource: {
    collection: string;
    pipeline?: any[]; // MongoDB aggregation pipeline
  };

  @Prop({ type: [Object] })
  filters: ReportFilter[];

  @Prop({ type: [Object] })
  columns: ReportColumn[];

  @Prop({ type: Object })
  sorting: {
    field: string;
    order: 'asc' | 'desc';
  };

  @Prop({ type: Object })
  grouping: {
    field: string;
    aggregations?: string[];
  };

  @Prop({ type: Object })
  scheduleConfig: ReportScheduleConfig;

  @Prop({ type: Object })
  styling: {
    orientation?: 'portrait' | 'landscape';
    pageSize?: 'A4' | 'Letter' | 'Legal';
    fontSize?: number;
    headerColor?: string;
    showLogo?: boolean;
    showPageNumbers?: boolean;
  };

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

export const ReportSchema = SchemaFactory.createForClass(Report);

// Indexes
ReportSchema.index({ organizationId: 1, status: 1 });
ReportSchema.index({ type: 1, status: 1 });
ReportSchema.index({ createdAt: -1 });
