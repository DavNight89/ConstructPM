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
exports.WorkflowExecution = exports.ExecutionStatus = void 0;
const typeorm_1 = require("typeorm");
const workflow_entity_1 = require("./workflow.entity");
var ExecutionStatus;
(function (ExecutionStatus) {
    ExecutionStatus["PENDING"] = "pending";
    ExecutionStatus["RUNNING"] = "running";
    ExecutionStatus["COMPLETED"] = "completed";
    ExecutionStatus["FAILED"] = "failed";
})(ExecutionStatus || (exports.ExecutionStatus = ExecutionStatus = {}));
let WorkflowExecution = class WorkflowExecution {
    id;
    workflowId;
    workflow;
    triggerData;
    executionStatus;
    startedAt;
    completedAt;
    errorMessage;
    logs;
    createdAt;
};
exports.WorkflowExecution = WorkflowExecution;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WorkflowExecution.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], WorkflowExecution.prototype, "workflowId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => workflow_entity_1.Workflow, (workflow) => workflow.executions),
    (0, typeorm_1.JoinColumn)({ name: 'workflowId' }),
    __metadata("design:type", workflow_entity_1.Workflow)
], WorkflowExecution.prototype, "workflow", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], WorkflowExecution.prototype, "triggerData", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ExecutionStatus,
        default: ExecutionStatus.PENDING,
    }),
    __metadata("design:type", String)
], WorkflowExecution.prototype, "executionStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], WorkflowExecution.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], WorkflowExecution.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WorkflowExecution.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], WorkflowExecution.prototype, "logs", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], WorkflowExecution.prototype, "createdAt", void 0);
exports.WorkflowExecution = WorkflowExecution = __decorate([
    (0, typeorm_1.Entity)('workflow_executions')
], WorkflowExecution);
//# sourceMappingURL=workflow-execution.entity.js.map