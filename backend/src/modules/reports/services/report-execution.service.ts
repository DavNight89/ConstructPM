import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  Report,
  ReportDocument,
  ReportFormat,
} from '../schemas/report.schema';
import {
  ReportExecution,
  ReportExecutionDocument,
  ExecutionStatus,
  GeneratedFile,
} from '../schemas/report-execution.schema';
import { PdfGeneratorService } from './pdf-generator.service';
import { ExcelGeneratorService } from './excel-generator.service';

@Injectable()
export class ReportExecutionService {
  private readonly logger = new Logger(ReportExecutionService.name);
  private readonly REPORTS_DIR = path.join(process.cwd(), 'reports', 'generated');

  constructor(
    @InjectModel(Report.name)
    private reportModel: Model<ReportDocument>,
    @InjectModel(ReportExecution.name)
    private executionModel: Model<ReportExecutionDocument>,
    @InjectConnection()
    private connection: Connection,
    private pdfGenerator: PdfGeneratorService,
    private excelGenerator: ExcelGeneratorService,
  ) {
    this.ensureReportsDirectory();
  }

  /**
   * Execute report generation
   */
  async executeReport(
    reportId: string,
    formats?: ReportFormat[],
    parameters?: Record<string, any>,
    executedBy?: string,
  ): Promise<ReportExecutionDocument> {
    this.logger.log(`Executing report: ${reportId}`);

    // Find report
    const report = await this.reportModel.findById(reportId);
    if (!report) {
      throw new NotFoundException(`Report ${reportId} not found`);
    }

    // Create execution record
    const execution = new this.executionModel({
      reportId: new Types.ObjectId(reportId),
      reportName: report.name,
      status: ExecutionStatus.PENDING,
      parameters: parameters || {},
      executedBy: executedBy ? new Types.ObjectId(executedBy) : undefined,
      organizationId: report.organizationId,
      isScheduled: false,
      startedAt: new Date(),
    });

    await execution.save();

    // Execute asynchronously
    this.executeReportAsync(report, execution, formats, parameters);

    return execution;
  }

  /**
   * Execute report asynchronously
   */
  private async executeReportAsync(
    report: ReportDocument,
    execution: ReportExecutionDocument,
    formats?: ReportFormat[],
    parameters?: Record<string, any>,
  ): Promise<void> {
    try {
      execution.status = ExecutionStatus.PROCESSING;
      await execution.save();

      // Fetch data
      const data = await this.fetchReportData(report, parameters);
      execution.recordCount = data.length;

      // Generate files in requested formats
      const formatsToGenerate = formats || report.formats || [ReportFormat.PDF];
      const generatedFiles: GeneratedFile[] = [];

      for (const format of formatsToGenerate) {
        const file = await this.generateReportFile(report, data, format);
        generatedFiles.push(file);
      }

      // Update execution with results
      execution.generatedFiles = generatedFiles;
      execution.status = ExecutionStatus.COMPLETED;
      execution.completedAt = new Date();
      execution.duration =
        execution.completedAt.getTime() - execution.startedAt.getTime();

      await execution.save();

      this.logger.log(
        `Report ${report._id} execution completed with ${data.length} records`,
      );
    } catch (error) {
      this.logger.error(`Report execution failed: ${error.message}`, error.stack);
      execution.status = ExecutionStatus.FAILED;
      execution.errorMessage = error.message;
      execution.errorStack = error.stack;
      execution.completedAt = new Date();
      execution.duration =
        execution.completedAt.getTime() - execution.startedAt.getTime();
      await execution.save();
    }
  }

  /**
   * Fetch report data from database
   */
  private async fetchReportData(
    report: ReportDocument,
    parameters?: Record<string, any>,
  ): Promise<any[]> {
    this.logger.log(`Fetching data for report: ${report.name}`);

    try {
      const collection = this.connection.collection(report.dataSource.collection);

      // Build query from filters and parameters
      const query = this.buildQuery(report.filters, parameters);

      // Execute query
      let cursor = collection.find(query);

      // Apply sorting
      if (report.sorting) {
        cursor = cursor.sort({
          [report.sorting.field]: report.sorting.order === 'asc' ? 1 : -1,
        });
      }

      // Execute
      const data = await cursor.toArray();

      this.logger.log(`Fetched ${data.length} records`);

      return data;
    } catch (error) {
      this.logger.error(`Data fetch failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Build MongoDB query from filters
   */
  private buildQuery(
    filters: any[],
    parameters?: Record<string, any>,
  ): Record<string, any> {
    const query: Record<string, any> = {};

    // Apply report filters
    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        const { field, operator, value } = filter;

        switch (operator) {
          case 'equals':
            query[field] = value;
            break;
          case 'not_equals':
            query[field] = { $ne: value };
            break;
          case 'greater_than':
            query[field] = { $gt: value };
            break;
          case 'less_than':
            query[field] = { $lt: value };
            break;
          case 'contains':
            query[field] = { $regex: value, $options: 'i' };
            break;
          case 'in':
            query[field] = { $in: Array.isArray(value) ? value : [value] };
            break;
        }
      });
    }

    // Apply runtime parameters
    if (parameters) {
      // Date range
      if (parameters.startDate || parameters.endDate) {
        query.createdAt = {};
        if (parameters.startDate) {
          query.createdAt.$gte = new Date(parameters.startDate);
        }
        if (parameters.endDate) {
          query.createdAt.$lte = new Date(parameters.endDate);
        }
      }

      // Other parameters
      Object.keys(parameters).forEach((key) => {
        if (!['startDate', 'endDate'].includes(key)) {
          query[key] = parameters[key];
        }
      });
    }

    return query;
  }

  /**
   * Generate report file in specific format
   */
  private async generateReportFile(
    report: ReportDocument,
    data: any[],
    format: ReportFormat,
  ): Promise<GeneratedFile> {
    this.logger.log(`Generating ${format} file for report: ${report.name}`);

    let buffer: Buffer;
    let filename: string;

    switch (format) {
      case ReportFormat.PDF:
        const pdfResult = await this.pdfGenerator.generatePdf({
          title: report.name,
          subtitle: report.description,
          columns: report.columns,
          data,
          styling: report.styling,
        });
        buffer = pdfResult.buffer;
        filename = pdfResult.filename;
        break;

      case ReportFormat.EXCEL:
        const excelResult = await this.excelGenerator.generateExcel({
          title: report.name,
          sheetName: report.name,
          columns: report.columns,
          data,
          includeTimestamp: true,
          includeSummary: true,
        });
        buffer = excelResult.buffer;
        filename = excelResult.filename;
        break;

      case ReportFormat.CSV:
        const csvResult = await this.excelGenerator.generateCsv({
          title: report.name,
          columns: report.columns,
          data,
        });
        buffer = csvResult.buffer;
        filename = csvResult.filename.replace('.xlsx', '.csv');
        break;

      case ReportFormat.JSON:
        buffer = Buffer.from(JSON.stringify(data, null, 2));
        filename = `${report.name}_${Date.now()}.json`;
        break;

      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    // Save file
    const filePath = path.join(this.REPORTS_DIR, filename);
    await fs.writeFile(filePath, buffer);

    this.logger.log(`Generated ${format} file: ${filename}`);

    return {
      format,
      filename,
      path: filePath,
      size: buffer.length,
      url: `/reports/download/${filename}`, // For download endpoint
    };
  }

  /**
   * Get execution by ID
   */
  async getExecutionById(executionId: string): Promise<ReportExecutionDocument> {
    const execution = await this.executionModel.findById(executionId);
    if (!execution) {
      throw new NotFoundException(`Execution ${executionId} not found`);
    }
    return execution;
  }

  /**
   * Get execution history for a report
   */
  async getExecutionHistory(
    reportId: string,
    limit = 50,
  ): Promise<ReportExecutionDocument[]> {
    return this.executionModel
      .find({ reportId: new Types.ObjectId(reportId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  /**
   * Get all executions with filters
   */
  async getAllExecutions(
    filters: {
      status?: ExecutionStatus;
      reportId?: string;
      organizationId?: string;
      startDate?: Date;
      endDate?: Date;
    },
    limit = 100,
  ): Promise<ReportExecutionDocument[]> {
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.reportId) {
      query.reportId = new Types.ObjectId(filters.reportId);
    }
    if (filters.organizationId) {
      query.organizationId = new Types.ObjectId(filters.organizationId);
    }
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.createdAt.$lte = filters.endDate;
      }
    }

    return this.executionModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  /**
   * Ensure reports directory exists
   */
  private async ensureReportsDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.REPORTS_DIR, { recursive: true });
      this.logger.log(`Reports directory ready: ${this.REPORTS_DIR}`);
    } catch (error) {
      this.logger.error(`Failed to create reports directory: ${error.message}`);
    }
  }

  /**
   * Download report file
   */
  async getReportFile(filename: string): Promise<Buffer> {
    const filePath = path.join(this.REPORTS_DIR, filename);
    try {
      return await fs.readFile(filePath);
    } catch (error) {
      throw new NotFoundException(`File ${filename} not found`);
    }
  }
}
