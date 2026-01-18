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
exports.Workflow = exports.WorkflowStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const workflow_execution_entity_1 = require("./workflow-execution.entity");
var WorkflowStatus;
(function (WorkflowStatus) {
    WorkflowStatus["ACTIVE"] = "active";
    WorkflowStatus["PAUSED"] = "paused";
    WorkflowStatus["ARCHIVED"] = "archived";
})(WorkflowStatus || (exports.WorkflowStatus = WorkflowStatus = {}));
let Workflow = class Workflow {
    id;
    name;
    description;
    status;
    triggerType;
    triggerConfig;
    conditions;
    actions;
    executionCount;
    lastExecution;
    createdBy;
    creator;
    executions;
    createdAt;
    updatedAt;
};
exports.Workflow = Workflow;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Workflow.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Workflow.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Workflow.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: WorkflowStatus,
        default: WorkflowStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Workflow.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Workflow.prototype, "triggerType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], Workflow.prototype, "triggerConfig", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], Workflow.prototype, "conditions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Array)
], Workflow.prototype, "actions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Workflow.prototype, "executionCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Workflow.prototype, "lastExecution", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Workflow.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'createdBy' }),
    __metadata("design:type", user_entity_1.User)
], Workflow.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => workflow_execution_entity_1.WorkflowExecution, (execution) => execution.workflow),
    __metadata("design:type", Array)
], Workflow.prototype, "executions", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Workflow.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Workflow.prototype, "updatedAt", void 0);
exports.Workflow = Workflow = __decorate([
    (0, typeorm_1.Entity)('workflows')
], Workflow);
//# sourceMappingURL=workflow.entity.js.map