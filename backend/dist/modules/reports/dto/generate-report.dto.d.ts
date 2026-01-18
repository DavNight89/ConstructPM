import { ReportFormat } from '../schemas/report.schema';
export declare class GenerateReportDto {
    formats?: ReportFormat[];
    parameters?: Record<string, any>;
    metadata?: Record<string, any>;
}
