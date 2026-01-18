import { StreamableFile } from '@nestjs/common';
import type { Response } from 'express';
import { ReportsService } from './reports.service';
import { ReportExecutionService } from './services/report-execution.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { GenerateReportDto } from './dto/generate-report.dto';
import { ReportStatus } from './schemas/report.schema';
import { ExecutionStatus } from './schemas/report-execution.schema';
export declare class ReportsController {
    private readonly reportsService;
    private readonly executionService;
    constructor(reportsService: ReportsService, executionService: ReportExecutionService);
    create(createReportDto: CreateReportDto): Promise<import("./schemas/report.schema").ReportDocument>;
    findAll(organizationId?: string, type?: string, status?: ReportStatus): Promise<import("./schemas/report.schema").ReportDocument[]>;
    getStatistics(organizationId?: string): Promise<any>;
    findOne(id: string): Promise<import("./schemas/report.schema").ReportDocument>;
    update(id: string, updateReportDto: UpdateReportDto): Promise<import("./schemas/report.schema").ReportDocument>;
    remove(id: string): Promise<{
        message: string;
    }>;
    hardDelete(id: string): Promise<{
        message: string;
    }>;
    duplicate(id: string): Promise<import("./schemas/report.schema").ReportDocument>;
    generate(id: string, generateDto: GenerateReportDto): Promise<import("./schemas/report-execution.schema").ReportExecutionDocument>;
    getExecutionHistory(id: string, limit?: number): Promise<import("./schemas/report-execution.schema").ReportExecutionDocument[]>;
    getExecutionById(executionId: string): Promise<import("./schemas/report-execution.schema").ReportExecutionDocument>;
    getAllExecutions(status?: ExecutionStatus, reportId?: string, organizationId?: string, startDate?: string, endDate?: string, limit?: number): Promise<import("./schemas/report-execution.schema").ReportExecutionDocument[]>;
    downloadFile(filename: string, res: Response): Promise<StreamableFile>;
}
