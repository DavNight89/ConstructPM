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
exports.GenerateReportDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const report_schema_1 = require("../schemas/report.schema");
class GenerateReportDto {
    formats;
    parameters;
    metadata;
}
exports.GenerateReportDto = GenerateReportDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: report_schema_1.ReportFormat,
        isArray: true,
        example: [report_schema_1.ReportFormat.PDF],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(report_schema_1.ReportFormat, { each: true }),
    __metadata("design:type", Array)
], GenerateReportDto.prototype, "formats", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: {
            startDate: '2025-01-01',
            endDate: '2025-01-31',
            status: 'completed',
        },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], GenerateReportDto.prototype, "parameters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: {
            source: 'manual',
            requestedBy: 'manager',
        },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], GenerateReportDto.prototype, "metadata", void 0);
//# sourceMappingURL=generate-report.dto.js.map