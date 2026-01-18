"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reports_service_1 = require("./reports.service");
const report_execution_service_1 = require("./services/report-execution.service");
const create_report_dto_1 = require("./dto/create-report.dto");
const update_report_dto_1 = require("./dto/update-report.dto");
const generate_report_dto_1 = require("./dto/generate-report.dto");
const report_schema_1 = require("./schemas/report.schema");
const report_execution_schema_1 = require("./schemas/report-execution.schema");
let ReportsController = class ReportsController {
    reportsService;
    executionService;
    constructor(reportsService, executionService) {
        this.reportsService = reportsService;
        this.executionService = executionService;
    }
    async create(createReportDto) {
        const userId = '507f1f77bcf86cd799439011';
        const organizationId = '507f1f77bcf86cd799439012';
        return this.reportsService.create(createReportDto, userId, organizationId);
    }
    async findAll(organizationId, type, status) {
        return this.reportsService.findAll({
            organizationId,
            type,
            status,
        });
    }
    async getStatistics(organizationId) {
        return this.reportsService.getStatistics(organizationId);
    }
    async findOne(id) {
        return this.reportsService.findOne(id);
    }
    async update(id, updateReportDto) {
        return this.reportsService.update(id, updateReportDto);
    }
    async remove(id) {
        await this.reportsService.remove(id);
        return { message: 'Report archived successfully' };
    }
    async hardDelete(id) {
        await this.reportsService.hardDelete(id);
        return { message: 'Report permanently deleted' };
    }
    async duplicate(id) {
        const userId = '507f1f77bcf86cd799439011';
        return this.reportsService.duplicate(id, userId);
    }
    async generate(id, generateDto) {
        const userId = '507f1f77bcf86cd799439011';
        return this.executionService.executeReport(id, generateDto.formats, generateDto.parameters, userId);
    }
    async getExecutionHistory(id, limit) {
        return this.executionService.getExecutionHistory(id, limit || 50);
    }
    async getExecutionById(executionId) {
        return this.executionService.getExecutionById(executionId);
    }
    async getAllExecutions(status, reportId, organizationId, startDate, endDate, limit) {
        return this.executionService.getAllExecutions({
            status,
            reportId,
            organizationId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        }, limit || 100);
    }
    async downloadFile(filename, res) {
        const file = await this.executionService.getReportFile(filename);
        const ext = filename.split('.').pop()?.toLowerCase();
        const contentTypes = {
            pdf: 'application/pdf',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            csv: 'text/csv',
            json: 'application/json',
        };
        res.set({
            'Content-Type': contentTypes[ext || 'pdf'] || 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${filename}"`,
        });
        return new common_1.StreamableFile(file);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new report' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Report created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid report configuration' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_report_dto_1.CreateReportDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reports' }),
    (0, swagger_1.ApiQuery)({ name: 'organizationId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: report_schema_1.ReportStatus }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of reports' }),
    __param(0, (0, common_1.Query)('organizationId')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get report statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'organizationId', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report statistics' }),
    __param(0, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a report by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Report not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Report not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_report_dto_1.UpdateReportDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a report (soft delete)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Report archived successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Report not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)(':id/hard'),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete a report' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Report permanently deleted',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Report not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "hardDelete", null);
__decorate([
    (0, common_1.Post)(':id/duplicate'),
    (0, swagger_1.ApiOperation)({ summary: 'Duplicate a report' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Report duplicated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Report not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "duplicate", null);
__decorate([
    (0, common_1.Post)(':id/generate'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a report' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Report generation started' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Report not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, generate_report_dto_1.GenerateReportDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "generate", null);
__decorate([
    (0, common_1.Get)(':id/executions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get execution history for a report' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Execution history' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getExecutionHistory", null);
__decorate([
    (0, common_1.Get)('executions/:executionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get execution details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Execution details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Execution not found' }),
    __param(0, (0, common_1.Param)('executionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getExecutionById", null);
__decorate([
    (0, common_1.Get)('executions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all report executions with filters' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: report_execution_schema_1.ExecutionStatus }),
    (0, swagger_1.ApiQuery)({ name: 'reportId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'organizationId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of executions' }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('reportId')),
    __param(2, (0, common_1.Query)('organizationId')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAllExecutions", null);
__decorate([
    (0, common_1.Get)('download/:filename'),
    (0, swagger_1.ApiOperation)({ summary: 'Download generated report file' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'File downloaded' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'File not found' }),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "downloadFile", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService,
        report_execution_service_1.ReportExecutionService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map