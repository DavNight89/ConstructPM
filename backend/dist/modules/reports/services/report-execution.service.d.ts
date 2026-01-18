import { Model, Connection } from 'mongoose';
import { ReportDocument, ReportFormat } from '../schemas/report.schema';
import { ReportExecutionDocument, ExecutionStatus } from '../schemas/report-execution.schema';
import { PdfGeneratorService } from './pdf-generator.service';
import { ExcelGeneratorService } from './excel-generator.service';
export declare class ReportExecutionService {
    private reportModel;
    private executionModel;
    private connection;
    private pdfGenerator;
    private excelGenerator;
    private readonly logger;
    private readonly REPORTS_DIR;
    constructor(reportModel: Model<ReportDocument>, executionModel: Model<ReportExecutionDocument>, connection: Connection, pdfGenerator: PdfGeneratorService, excelGenerator: ExcelGeneratorService);
    executeReport(reportId: string, formats?: ReportFormat[], parameters?: Record<string, any>, executedBy?: string): Promise<ReportExecutionDocument>;
    private executeReportAsync;
    private fetchReportData;
    private buildQuery;
    private generateReportFile;
    getExecutionById(executionId: string): Promise<ReportExecutionDocument>;
    getExecutionHistory(reportId: string, limit?: number): Promise<ReportExecutionDocument[]>;
    getAllExecutions(filters: {
        status?: ExecutionStatus;
        reportId?: string;
        organizationId?: string;
        startDate?: Date;
        endDate?: Date;
    }, limit?: number): Promise<ReportExecutionDocument[]>;
    private ensureReportsDirectory;
    getReportFile(filename: string): Promise<Buffer>;
}
