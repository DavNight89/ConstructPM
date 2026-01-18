import { Document, Types } from 'mongoose';
export type ReportDocument = Report & Document;
export declare enum ReportType {
    FORM_SUBMISSIONS = "form_submissions",
    PROJECT_SUMMARY = "project_summary",
    WORKER_ACTIVITY = "worker_activity",
    TIME_TRACKING = "time_tracking",
    FINANCIAL = "financial",
    CUSTOM = "custom"
}
export declare enum ReportFormat {
    PDF = "pdf",
    EXCEL = "excel",
    CSV = "csv",
    JSON = "json"
}
export declare enum ReportSchedule {
    ONCE = "once",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly"
}
export declare enum ReportStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    ARCHIVED = "archived"
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
    time?: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    recipients: string[];
    formats: ReportFormat[];
}
export declare class Report {
    name: string;
    description: string;
    type: ReportType;
    status: ReportStatus;
    formats: ReportFormat[];
    dataSource: {
        collection: string;
        pipeline?: any[];
    };
    filters: ReportFilter[];
    columns: ReportColumn[];
    sorting: {
        field: string;
        order: 'asc' | 'desc';
    };
    grouping: {
        field: string;
        aggregations?: string[];
    };
    scheduleConfig: ReportScheduleConfig;
    styling: {
        orientation?: 'portrait' | 'landscape';
        pageSize?: 'A4' | 'Letter' | 'Legal';
        fontSize?: number;
        headerColor?: string;
        showLogo?: boolean;
        showPageNumbers?: boolean;
    };
    createdBy: Types.ObjectId;
    organizationId: Types.ObjectId;
    metadata: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const ReportSchema: import("mongoose").Schema<Report, import("mongoose").Model<Report, any, any, any, Document<unknown, any, Report, any, {}> & Report & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Report, Document<unknown, {}, import("mongoose").FlatRecord<Report>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Report> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
