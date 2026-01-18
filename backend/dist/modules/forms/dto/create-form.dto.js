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
exports.CreateFormDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class FormFieldDto {
    id;
    type;
    label;
    placeholder;
    required;
    validation;
    options;
    defaultValue;
    properties;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'field_1' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FormFieldDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'text', description: 'Field type: text, number, select, checkbox, date, textarea, file, signature' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FormFieldDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Project Name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FormFieldDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Enter project name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FormFieldDto.prototype, "placeholder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FormFieldDto.prototype, "required", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: { minLength: 3, maxLength: 100 } }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], FormFieldDto.prototype, "validation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['Option 1', 'Option 2'], description: 'For select/radio fields' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], FormFieldDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Default value' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], FormFieldDto.prototype, "defaultValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { gridWidth: 12, showIf: null } }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], FormFieldDto.prototype, "properties", void 0);
class FormSettingsDto {
    requireGPS;
    requireSignature;
    allowOffline;
    emailNotifications;
    autoSubmit;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FormSettingsDto.prototype, "requireGPS", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FormSettingsDto.prototype, "requireSignature", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FormSettingsDto.prototype, "allowOffline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FormSettingsDto.prototype, "emailNotifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FormSettingsDto.prototype, "autoSubmit", void 0);
class CreateFormDto {
    name;
    category;
    version;
    fields;
    settings;
    logic;
    metadata;
}
exports.CreateFormDto = CreateFormDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Daily Inspection Form' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFormDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'inspection', description: 'Form category: inspection, safety, timesheet, incident, etc.' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFormDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateFormDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [FormFieldDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => FormFieldDto),
    __metadata("design:type", Array)
], CreateFormDto.prototype, "fields", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: FormSettingsDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FormSettingsDto),
    __metadata("design:type", FormSettingsDto)
], CreateFormDto.prototype, "settings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: [{
                condition: { field: 'field_1', operator: 'equals', value: 'yes' },
                actions: [{ type: 'show', target: 'field_2' }]
            }]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateFormDto.prototype, "logic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { createdBy: 'user-id-123' } }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateFormDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-form.dto.js.map