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
exports.ReportExecutionSchema = exports.ReportExecution = exports.ExecutionStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ExecutionStatus;
(function (ExecutionStatus) {
    ExecutionStatus["PENDING"] = "pending";
    ExecutionStatus["PROCESSING"] = "processing";
    ExecutionStatus["COMPLETED"] = "completed";
    ExecutionStatus["FAILED"] = "failed";
})(ExecutionStatus || (exports.ExecutionStatus = ExecutionStatus = {}));
let ReportExecution = class ReportExecution {
    reportId;
    reportName;
    status;
    startedAt;
    completedAt;
    duration;
    generatedFiles;
    recordCount;
    parameters;
    errorMessage;
    errorStack;
    executedBy;
    organizationId;
    isScheduled;
    metadata;
    createdAt;
    updatedAt;
};
exports.ReportExecution = ReportExecution;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Report', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ReportExecution.prototype, "reportId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ReportExecution.prototype, "reportName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ExecutionStatus, default: ExecutionStatus.PENDING }),
    __metadata("design:type", String)
], ReportExecution.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ReportExecution.prototype, "startedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ReportExecution.prototype, "completedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], ReportExecution.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object] }),
    __metadata("design:type", Array)
], ReportExecution.prototype, "generatedFiles", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], ReportExecution.prototype, "recordCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], ReportExecution.prototype, "parameters", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReportExecution.prototype, "errorMessage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReportExecution.prototype, "errorStack", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ReportExecution.prototype, "executedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Organization' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ReportExecution.prototype, "organizationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ReportExecution.prototype, "isScheduled", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], ReportExecution.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ReportExecution.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ReportExecution.prototype, "updatedAt", void 0);
exports.ReportExecution = ReportExecution = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'report_executions' })
], ReportExecution);
exports.ReportExecutionSchema = mongoose_1.SchemaFactory.createForClass(ReportExecution);
exports.ReportExecutionSchema.index({ reportId: 1, createdAt: -1 });
exports.ReportExecutionSchema.index({ organizationId: 1, status: 1 });
exports.ReportExecutionSchema.index({ status: 1, createdAt: -1 });
exports.ReportExecutionSchema.index({ executedBy: 1, createdAt: -1 });
//# sourceMappingURL=report-execution.schema.js.map