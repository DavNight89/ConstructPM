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
exports.FilterProjectDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["PLANNING"] = "planning";
    ProjectStatus["ACTIVE"] = "active";
    ProjectStatus["ON_HOLD"] = "on_hold";
    ProjectStatus["COMPLETED"] = "completed";
    ProjectStatus["CANCELLED"] = "cancelled";
})(ProjectStatus || (ProjectStatus = {}));
var ProjectPriority;
(function (ProjectPriority) {
    ProjectPriority["LOW"] = "low";
    ProjectPriority["MEDIUM"] = "medium";
    ProjectPriority["HIGH"] = "high";
    ProjectPriority["URGENT"] = "urgent";
})(ProjectPriority || (ProjectPriority = {}));
class FilterProjectDto {
    status;
    priority;
    managerId;
    search;
    page = 1;
    limit = 10;
}
exports.FilterProjectDto = FilterProjectDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ProjectStatus }),
    (0, class_validator_1.IsEnum)(ProjectStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterProjectDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ProjectPriority }),
    (0, class_validator_1.IsEnum)(ProjectPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterProjectDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'af35a1ad-6260-4ab9-9cb8-9275df4ac70c' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterProjectDto.prototype, "managerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'building', description: 'Search in name and description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterProjectDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FilterProjectDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, default: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FilterProjectDto.prototype, "limit", void 0);
//# sourceMappingURL=filter-project.dto.js.map