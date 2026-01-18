"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ReportExecutionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportExecutionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const report_schema_1 = require("../schemas/report.schema");
const report_execution_schema_1 = require("../schemas/report-execution.schema");
const pdf_generator_service_1 = require("./pdf-generator.service");
const excel_generator_service_1 = require("./excel-generator.service");
let ReportExecutionService = ReportExecutionService_1 = class ReportExecutionService {
    reportModel;
    executionModel;
    connection;
    pdfGenerator;
    excelGenerator;
    logger = new common_1.Logger(ReportExecutionService_1.name);
    REPORTS_DIR = path.join(process.cwd(), 'reports', 'generated');
    constructor(reportModel, executionModel, connection, pdfGenerator, excelGenerator) {
        this.reportModel = reportModel;
        this.executionModel = executionModel;
        this.connection = connection;
        this.pdfGenerator = pdfGenerator;
        this.excelGenerator = excelGenerator;
        this.ensureReportsDirectory();
    }
    async executeReport(reportId, formats, parameters, executedBy) {
        this.logger.log(`Executing report: ${reportId}`);
        const report = await this.reportModel.findById(reportId);
        if (!report) {
            throw new common_1.NotFoundException(`Report ${reportId} not found`);
        }
        const execution = new this.executionModel({
            reportId: new mongoose_2.Types.ObjectId(reportId),
            reportName: report.name,
            status: report_execution_schema_1.ExecutionStatus.PENDING,
            parameters: parameters || {},
            executedBy: executedBy ? new mongoose_2.Types.ObjectId(executedBy) : undefined,
            organizationId: report.organizationId,
            isScheduled: false,
            startedAt: new Date(),
        });
        await execution.save();
        this.executeReportAsync(report, execution, formats, parameters);
        return execution;
    }
    async executeReportAsync(report, execution, formats, parameters) {
        try {
            execution.status = report_execution_schema_1.ExecutionStatus.PROCESSING;
            await execution.save();
            const data = await this.fetchReportData(report, parameters);
            execution.recordCount = data.length;
            const formatsToGenerate = formats || report.formats || [report_schema_1.ReportFormat.PDF];
            const generatedFiles = [];
            for (const format of formatsToGenerate) {
                const file = await this.generateReportFile(report, data, format);
                generatedFiles.push(file);
            }
            execution.generatedFiles = generatedFiles;
            execution.status = report_execution_schema_1.ExecutionStatus.COMPLETED;
            execution.completedAt = new Date();
            execution.duration =
                execution.completedAt.getTime() - execution.startedAt.getTime();
            await execution.save();
            this.logger.log(`Report ${report._id} execution completed with ${data.length} records`);
        }
        catch (error) {
            this.logger.error(`Report execution failed: ${error.message}`, error.stack);
            execution.status = report_execution_schema_1.ExecutionStatus.FAILED;
            execution.errorMessage = error.message;
            execution.errorStack = error.stack;
            execution.completedAt = new Date();
            execution.duration =
                execution.completedAt.getTime() - execution.startedAt.getTime();
            await execution.save();
        }
    }
    async fetchReportData(report, parameters) {
        this.logger.log(`Fetching data for report: ${report.name}`);
        try {
            const collection = this.connection.collection(report.dataSource.collection);
            const query = this.buildQuery(report.filters, parameters);
            let cursor = collection.find(query);
            if (report.sorting) {
                cursor = cursor.sort({
                    [report.sorting.field]: report.sorting.order === 'asc' ? 1 : -1,
                });
            }
            const data = await cursor.toArray();
            this.logger.log(`Fetched ${data.length} records`);
            return data;
        }
        catch (error) {
            this.logger.error(`Data fetch failed: ${error.message}`);
            throw error;
        }
    }
    buildQuery(filters, parameters) {
        const query = {};
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
        if (parameters) {
            if (parameters.startDate || parameters.endDate) {
                query.createdAt = {};
                if (parameters.startDate) {
                    query.createdAt.$gte = new Date(parameters.startDate);
                }
                if (parameters.endDate) {
                    query.createdAt.$lte = new Date(parameters.endDate);
                }
            }
            Object.keys(parameters).forEach((key) => {
                if (!['startDate', 'endDate'].includes(key)) {
                    query[key] = parameters[key];
                }
            });
        }
        return query;
    }
    async generateReportFile(report, data, format) {
        this.logger.log(`Generating ${format} file for report: ${report.name}`);
        let buffer;
        let filename;
        switch (format) {
            case report_schema_1.ReportFormat.PDF:
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
            case report_schema_1.ReportFormat.EXCEL:
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
            case report_schema_1.ReportFormat.CSV:
                const csvResult = await this.excelGenerator.generateCsv({
                    title: report.name,
                    columns: report.columns,
                    data,
                });
                buffer = csvResult.buffer;
                filename = csvResult.filename.replace('.xlsx', '.csv');
                break;
            case report_schema_1.ReportFormat.JSON:
                buffer = Buffer.from(JSON.stringify(data, null, 2));
                filename = `${report.name}_${Date.now()}.json`;
                break;
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
        const filePath = path.join(this.REPORTS_DIR, filename);
        await fs.writeFile(filePath, buffer);
        this.logger.log(`Generated ${format} file: ${filename}`);
        return {
            format,
            filename,
            path: filePath,
            size: buffer.length,
            url: `/reports/download/${filename}`,
        };
    }
    async getExecutionById(executionId) {
        const execution = await this.executionModel.findById(executionId);
        if (!execution) {
            throw new common_1.NotFoundException(`Execution ${executionId} not found`);
        }
        return execution;
    }
    async getExecutionHistory(reportId, limit = 50) {
        return this.executionModel
            .find({ reportId: new mongoose_2.Types.ObjectId(reportId) })
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }
    async getAllExecutions(filters, limit = 100) {
        const query = {};
        if (filters.status) {
            query.status = filters.status;
        }
        if (filters.reportId) {
            query.reportId = new mongoose_2.Types.ObjectId(filters.reportId);
        }
        if (filters.organizationId) {
            query.organizationId = new mongoose_2.Types.ObjectId(filters.organizationId);
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
    async ensureReportsDirectory() {
        try {
            await fs.mkdir(this.REPORTS_DIR, { recursive: true });
            this.logger.log(`Reports directory ready: ${this.REPORTS_DIR}`);
        }
        catch (error) {
            this.logger.error(`Failed to create reports directory: ${error.message}`);
        }
    }
    async getReportFile(filename) {
        const filePath = path.join(this.REPORTS_DIR, filename);
        try {
            return await fs.readFile(filePath);
        }
        catch (error) {
            throw new common_1.NotFoundException(`File ${filename} not found`);
        }
    }
};
exports.ReportExecutionService = ReportExecutionService;
exports.ReportExecutionService = ReportExecutionService = ReportExecutionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(report_schema_1.Report.name)),
    __param(1, (0, mongoose_1.InjectModel)(report_execution_schema_1.ReportExecution.name)),
    __param(2, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Connection,
        pdf_generator_service_1.PdfGeneratorService,
        excel_generator_service_1.ExcelGeneratorService])
], ReportExecutionService);
//# sourceMappingURL=report-execution.service.js.map