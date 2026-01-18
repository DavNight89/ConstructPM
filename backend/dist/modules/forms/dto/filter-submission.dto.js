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
exports.FilterSubmissionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const submission_schema_1 = require("../schemas/submission.schema");
class FilterSubmissionDto {
    formId;
    projectId;
    workerId;
    jobId;
    status;
    page = 1;
    limit = 10;
}
exports.FilterSubmissionDto = FilterSubmissionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '507f1f77bcf86cd799439011' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterSubmissionDto.prototype, "formId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'project-uuid-123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterSubmissionDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'worker-uuid-456' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterSubmissionDto.prototype, "workerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'job-uuid-789' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterSubmissionDto.prototype, "jobId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: submission_schema_1.SubmissionStatus }),
    (0, class_validator_1.IsEnum)(submission_schema_1.SubmissionStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterSubmissionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FilterSubmissionDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, default: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FilterSubmissionDto.prototype, "limit", void 0);
//# sourceMappingURL=filter-submission.dto.js.map