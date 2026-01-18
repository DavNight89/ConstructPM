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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateReportDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const report_schema_1 = require("../schemas/report.schema");
class ReportFilterDto {
    field;
    operator;
    value;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'status' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportFilterDto.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'equals' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportFilterDto.prototype, "operator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'completed' }),
    __metadata("design:type", Object)
], ReportFilterDto.prototype, "value", void 0);
class ReportColumnDto {
    field;
    label;
    type;
    format;
    aggregate;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'projectName' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportColumnDto.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Project Name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportColumnDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['string', 'number', 'date', 'boolean'] }),
    (0, class_validator_1.IsEnum)(['string', 'number', 'date', 'boolean']),
    __metadata("design:type", String)
], ReportColumnDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'currency' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportColumnDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['sum', 'avg', 'min', 'max', 'count'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['sum', 'avg', 'min', 'max', 'count']),
    __metadata("design:type", String)
], ReportColumnDto.prototype, "aggregate", void 0);
class CreateReportDto {
    name;
    description;
    type;
    status;
    formats;
    dataSource;
    filters;
    columns;
    sorting;
    grouping;
    scheduleConfig;
    styling;
    metadata;
}
exports.CreateReportDto = CreateReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Monthly Project Summary' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Summary of all projects for the month' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: report_schema_1.ReportType, example: report_schema_1.ReportType.PROJECT_SUMMARY }),
    (0, class_validator_1.IsEnum)(report_schema_1.ReportType),
    __metadata("design:type", String)
], CreateReportDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: report_schema_1.ReportStatus, example: report_schema_1.ReportStatus.ACTIVE }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(report_schema_1.ReportStatus),
    __metadata("design:type", String)
], CreateReportDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: report_schema_1.ReportFormat,
        isArray: true,
        example: [report_schema_1.ReportFormat.PDF, report_schema_1.ReportFormat.EXCEL],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(report_schema_1.ReportFormat, { each: true }),
    __metadata("design:type", Array)
], CreateReportDto.prototype, "formats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            collection: 'projects',
            pipeline: [],
        },
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateReportDto.prototype, "dataSource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [ReportFilterDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReportFilterDto),
    __metadata("design:type", Array)
], CreateReportDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ReportColumnDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReportColumnDto),
    __metadata("design:type", Array)
], CreateReportDto.prototype, "columns", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: { field: 'createdAt', order: 'desc' },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateReportDto.prototype, "sorting", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: { field: 'category', aggregations: ['count', 'sum'] },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateReportDto.prototype, "grouping", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: {
            frequency: 'monthly',
            dayOfMonth: 1,
            time: '09:00',
            recipients: ['manager@company.com'],
            formats: ['pdf', 'excel'],
        },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateReportDto.prototype, "scheduleConfig", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: {
            orientation: 'landscape',
            pageSize: 'A4',
            fontSize: 10,
            headerColor: '#2563eb',
            showLogo: true,
            showPageNumbers: true,
        },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateReportDto.prototype, "styling", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: { tags: ['monthly', 'management'] },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateReportDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-report.dto.js.map