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
exports.CreateSubmissionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSubmissionDto {
    formId;
    formVersion;
    projectId;
    workerId;
    jobId;
    data;
    metadata;
}
exports.CreateSubmissionDto = CreateSubmissionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSubmissionDto.prototype, "formId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSubmissionDto.prototype, "formVersion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'project-uuid-123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSubmissionDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'worker-uuid-456' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSubmissionDto.prototype, "workerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'job-uuid-789' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSubmissionDto.prototype, "jobId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { field_1: 'Answer 1', field_2: 42, field_3: true } }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateSubmissionDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: {
            gpsLocation: { lat: 40.7128, lng: -74.0060 },
            signature: 'base64-encoded-signature',
            photos: ['photo-url-1', 'photo-url-2']
        }
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateSubmissionDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-submission.dto.js.map