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
exports.ExecuteWorkflowDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ExecuteWorkflowDto {
    triggerData;
    triggeredBy;
    metadata;
}
exports.ExecuteWorkflowDto = ExecuteWorkflowDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            formId: '507f1f77bcf86cd799439011',
            submissionId: '507f1f77bcf86cd799439012',
            data: {
                name: 'John Doe',
                email: 'john@example.com',
            },
        },
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ExecuteWorkflowDto.prototype, "triggerData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '507f1f77bcf86cd799439013' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExecuteWorkflowDto.prototype, "triggeredBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: {
            source: 'manual',
            ip: '192.168.1.1',
        },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ExecuteWorkflowDto.prototype, "metadata", void 0);
//# sourceMappingURL=execute-workflow.dto.js.map