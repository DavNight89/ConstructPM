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
exports.CreateWorkflowDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const workflow_schema_1 = require("../schemas/workflow.schema");
class WorkflowConditionDto {
    field;
    operator;
    value;
    logicalOperator;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'status' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], WorkflowConditionDto.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: workflow_schema_1.ConditionOperator, example: workflow_schema_1.ConditionOperator.EQUALS }),
    (0, class_validator_1.IsEnum)(workflow_schema_1.ConditionOperator),
    __metadata("design:type", String)
], WorkflowConditionDto.prototype, "operator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'completed' }),
    __metadata("design:type", Object)
], WorkflowConditionDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['AND', 'OR'], example: 'AND' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['AND', 'OR']),
    __metadata("design:type", String)
], WorkflowConditionDto.prototype, "logicalOperator", void 0);
class WorkflowActionDto {
    type;
    config;
    conditions;
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: workflow_schema_1.ActionType, example: workflow_schema_1.ActionType.SEND_EMAIL }),
    (0, class_validator_1.IsEnum)(workflow_schema_1.ActionType),
    __metadata("design:type", String)
], WorkflowActionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            to: '{{user.email}}',
            subject: 'Form Submitted',
            template: 'form-submitted',
        },
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], WorkflowActionDto.prototype, "config", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [WorkflowConditionDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => WorkflowConditionDto),
    __metadata("design:type", Array)
], WorkflowActionDto.prototype, "conditions", void 0);
class WorkflowTriggerDto {
    type;
    config;
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: workflow_schema_1.TriggerType, example: workflow_schema_1.TriggerType.FORM_SUBMIT }),
    (0, class_validator_1.IsEnum)(workflow_schema_1.TriggerType),
    __metadata("design:type", String)
], WorkflowTriggerDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            formId: '507f1f77bcf86cd799439011',
            conditions: [],
        },
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], WorkflowTriggerDto.prototype, "config", void 0);
class CreateWorkflowDto {
    name;
    description;
    trigger;
    actions;
    conditions;
    isActive;
    metadata;
}
exports.CreateWorkflowDto = CreateWorkflowDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Send email on form submission' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWorkflowDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Automatically sends email when form is submitted' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWorkflowDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: WorkflowTriggerDto }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => WorkflowTriggerDto),
    __metadata("design:type", Object)
], CreateWorkflowDto.prototype, "trigger", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [WorkflowActionDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => WorkflowActionDto),
    __metadata("design:type", Array)
], CreateWorkflowDto.prototype, "actions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [WorkflowConditionDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => WorkflowConditionDto),
    __metadata("design:type", Array)
], CreateWorkflowDto.prototype, "conditions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateWorkflowDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: {
            tags: ['email', 'notification'],
            priority: 'high',
        },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateWorkflowDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-workflow.dto.js.map