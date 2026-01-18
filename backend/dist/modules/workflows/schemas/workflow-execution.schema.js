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
exports.WorkflowExecutionSchema = exports.WorkflowExecution = exports.ExecutionStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ExecutionStatus;
(function (ExecutionStatus) {
    ExecutionStatus["PENDING"] = "pending";
    ExecutionStatus["RUNNING"] = "running";
    ExecutionStatus["SUCCESS"] = "success";
    ExecutionStatus["FAILED"] = "failed";
    ExecutionStatus["PARTIAL"] = "partial";
})(ExecutionStatus || (exports.ExecutionStatus = ExecutionStatus = {}));
let WorkflowExecution = class WorkflowExecution {
    workflowId;
    workflowName;
    status;
    triggerData;
    actionResults;
    startedAt;
    completedAt;
    duration;
    errorMessage;
    metadata;
    triggeredBy;
    organizationId;
    createdAt;
    updatedAt;
};
exports.WorkflowExecution = WorkflowExecution;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Workflow', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], WorkflowExecution.prototype, "workflowId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WorkflowExecution.prototype, "workflowName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ExecutionStatus, default: ExecutionStatus.PENDING }),
    __metadata("design:type", String)
], WorkflowExecution.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], WorkflowExecution.prototype, "triggerData", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], WorkflowExecution.prototype, "actionResults", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], WorkflowExecution.prototype, "startedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], WorkflowExecution.prototype, "completedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], WorkflowExecution.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WorkflowExecution.prototype, "errorMessage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], WorkflowExecution.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], WorkflowExecution.prototype, "triggeredBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Organization' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], WorkflowExecution.prototype, "organizationId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], WorkflowExecution.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], WorkflowExecution.prototype, "updatedAt", void 0);
exports.WorkflowExecution = WorkflowExecution = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'workflow_executions' })
], WorkflowExecution);
exports.WorkflowExecutionSchema = mongoose_1.SchemaFactory.createForClass(WorkflowExecution);
exports.WorkflowExecutionSchema.index({ workflowId: 1, createdAt: -1 });
exports.WorkflowExecutionSchema.index({ organizationId: 1, status: 1 });
exports.WorkflowExecutionSchema.index({ status: 1, createdAt: -1 });
exports.WorkflowExecutionSchema.index({ createdAt: -1 });
//# sourceMappingURL=workflow-execution.schema.js.map