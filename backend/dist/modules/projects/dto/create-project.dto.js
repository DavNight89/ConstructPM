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
exports.CreateProjectDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
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
class CreateProjectDto {
    name;
    description;
    address;
    budget;
    spent;
    startDate;
    endDate;
    status;
    priority;
    progress;
    location;
    managerId;
}
exports.CreateProjectDto = CreateProjectDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Downtown Office Building' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Commercial office building with 10 floors' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '123 Main St, City, State 12345' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000000, description: 'Budget in dollars' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "budget", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0, description: 'Amount spent so far' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "spent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-15' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], CreateProjectDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-31' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], CreateProjectDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: ProjectStatus,
        example: ProjectStatus.PLANNING,
        default: ProjectStatus.PLANNING,
    }),
    (0, class_validator_1.IsEnum)(ProjectStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: ProjectPriority,
        example: ProjectPriority.MEDIUM,
        default: ProjectPriority.MEDIUM,
    }),
    (0, class_validator_1.IsEnum)(ProjectPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 0,
        description: 'Completion percentage (0-100)',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "progress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: { lat: 40.7128, lng: -74.006 },
        description: 'GPS coordinates of project location',
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateProjectDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'af35a1ad-6260-4ab9-9cb8-9275df4ac70c',
        description: 'Project manager user ID',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "managerId", void 0);
//# sourceMappingURL=create-project.dto.js.map