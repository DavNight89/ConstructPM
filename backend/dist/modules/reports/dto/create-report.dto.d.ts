import { ReportType, ReportFormat, ReportStatus, ReportFilter, ReportColumn } from '../schemas/report.schema';
import type { ReportScheduleConfig } from '../schemas/report.schema';
export declare class CreateReportDto {
    name: string;
    description?: string;
    type: ReportType;
    status?: ReportStatus;
    formats?: ReportFormat[];
    dataSource: {
        collection: string;
        pipeline?: any[];
    };
    filters?: ReportFilter[];
    columns: ReportColumn[];
    sorting?: {
        field: string;
        order: 'asc' | 'desc';
    };
    grouping?: {
        field: string;
        aggregations?: string[];
    };
    scheduleConfig?: ReportScheduleConfig;
    styling?: {
        orientation?: 'portrait' | 'landscape';
        pageSize?: 'A4' | 'Letter' | 'Legal';
        fontSize?: number;
        headerColor?: string;
        showLogo?: boolean;
        showPageNumbers?: boolean;
    };
    metadata?: Record<string, any>;
}
