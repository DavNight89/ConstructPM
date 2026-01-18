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
exports.ApproveSubmissionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const submission_schema_1 = require("../schemas/submission.schema");
class ApproveSubmissionDto {
    status;
    userId;
    comment;
}
exports.ApproveSubmissionDto = ApproveSubmissionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: submission_schema_1.SubmissionStatus, example: submission_schema_1.SubmissionStatus.APPROVED }),
    (0, class_validator_1.IsEnum)(submission_schema_1.SubmissionStatus),
    __metadata("design:type", String)
], ApproveSubmissionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-id-123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApproveSubmissionDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Looks good, approved!' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ApproveSubmissionDto.prototype, "comment", void 0);
//# sourceMappingURL=approve-submission.dto.js.map