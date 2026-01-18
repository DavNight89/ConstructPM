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
exports.WorkflowSchema = exports.Workflow = exports.ConditionOperator = exports.ActionType = exports.TriggerType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var TriggerType;
(function (TriggerType) {
    TriggerType["FORM_SUBMIT"] = "form_submit";
    TriggerType["STATUS_CHANGE"] = "status_change";
    TriggerType["SCHEDULE"] = "schedule";
    TriggerType["MANUAL"] = "manual";
    TriggerType["WEBHOOK"] = "webhook";
})(TriggerType || (exports.TriggerType = TriggerType = {}));
var ActionType;
(function (ActionType) {
    ActionType["SEND_EMAIL"] = "send_email";
    ActionType["SEND_SMS"] = "send_sms";
    ActionType["UPDATE_DATABASE"] = "update_database";
    ActionType["CREATE_RECORD"] = "create_record";
    ActionType["WEBHOOK"] = "webhook";
    ActionType["ASSIGN_TASK"] = "assign_task";
    ActionType["UPDATE_STATUS"] = "update_status";
})(ActionType || (exports.ActionType = ActionType = {}));
var ConditionOperator;
(function (ConditionOperator) {
    ConditionOperator["EQUALS"] = "equals";
    ConditionOperator["NOT_EQUALS"] = "not_equals";
    ConditionOperator["GREATER_THAN"] = "greater_than";
    ConditionOperator["LESS_THAN"] = "less_than";
    ConditionOperator["CONTAINS"] = "contains";
    ConditionOperator["NOT_CONTAINS"] = "not_contains";
    ConditionOperator["IS_EMPTY"] = "is_empty";
    ConditionOperator["IS_NOT_EMPTY"] = "is_not_empty";
})(ConditionOperator || (exports.ConditionOperator = ConditionOperator = {}));
let Workflow = class Workflow {
    name;
    description;
    trigger;
    actions;
    conditions;
    isActive;
    createdBy;
    organizationId;
    metadata;
    createdAt;
    updatedAt;
};
exports.Workflow = Workflow;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Workflow.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Workflow.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], Workflow.prototype, "trigger", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], required: true }),
    __metadata("design:type", Array)
], Workflow.prototype, "actions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object] }),
    __metadata("design:type", Array)
], Workflow.prototype, "conditions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Workflow.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Workflow.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Organization' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Workflow.prototype, "organizationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Workflow.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Workflow.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Workflow.prototype, "updatedAt", void 0);
exports.Workflow = Workflow = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'workflows' })
], Workflow);
exports.WorkflowSchema = mongoose_1.SchemaFactory.createForClass(Workflow);
exports.WorkflowSchema.index({ organizationId: 1, isActive: 1 });
exports.WorkflowSchema.index({ 'trigger.type': 1 });
exports.WorkflowSchema.index({ createdAt: -1 });
//# sourceMappingURL=workflow.schema.js.map