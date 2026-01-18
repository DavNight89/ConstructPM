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
exports.FilterJobDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const job_entity_1 = require("../../../database/entities/job.entity");
class FilterJobDto {
    status;
    priority;
    projectId;
    workerId;
    search;
    page = 1;
    limit = 10;
}
exports.FilterJobDto = FilterJobDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: job_entity_1.JobStatus }),
    (0, class_validator_1.IsEnum)(job_entity_1.JobStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterJobDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: job_entity_1.JobPriority }),
    (0, class_validator_1.IsEnum)(job_entity_1.JobPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterJobDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'af35a1ad-6260-4ab9-9cb8-9275df4ac70c' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterJobDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'af35a1ad-6260-4ab9-9cb8-9275df4ac70c' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterJobDto.prototype, "workerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'repair', description: 'Search in title and description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterJobDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FilterJobDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, default: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FilterJobDto.prototype, "limit", void 0);
//# sourceMappingURL=filter-job.dto.js.map