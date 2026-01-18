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
exports.ReportSchema = exports.Report = exports.ReportStatus = exports.ReportSchedule = exports.ReportFormat = exports.ReportType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ReportType;
(function (ReportType) {
    ReportType["FORM_SUBMISSIONS"] = "form_submissions";
    ReportType["PROJECT_SUMMARY"] = "project_summary";
    ReportType["WORKER_ACTIVITY"] = "worker_activity";
    ReportType["TIME_TRACKING"] = "time_tracking";
    ReportType["FINANCIAL"] = "financial";
    ReportType["CUSTOM"] = "custom";
})(ReportType || (exports.ReportType = ReportType = {}));
var ReportFormat;
(function (ReportFormat) {
    ReportFormat["PDF"] = "pdf";
    ReportFormat["EXCEL"] = "excel";
    ReportFormat["CSV"] = "csv";
    ReportFormat["JSON"] = "json";
})(ReportFormat || (exports.ReportFormat = ReportFormat = {}));
var ReportSchedule;
(function (ReportSchedule) {
    ReportSchedule["ONCE"] = "once";
    ReportSchedule["DAILY"] = "daily";
    ReportSchedule["WEEKLY"] = "weekly";
    ReportSchedule["MONTHLY"] = "monthly";
    ReportSchedule["QUARTERLY"] = "quarterly";
})(ReportSchedule || (exports.ReportSchedule = ReportSchedule = {}));
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["DRAFT"] = "draft";
    ReportStatus["ACTIVE"] = "active";
    ReportStatus["ARCHIVED"] = "archived";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
let Report = class Report {
    name;
    description;
    type;
    status;
    formats;
    dataSource;
    filters;
    columns;
    sorting;
    grouping;
    scheduleConfig;
    styling;
    createdBy;
    organizationId;
    metadata;
    createdAt;
    updatedAt;
};
exports.Report = Report;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Report.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Report.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ReportType, required: true }),
    __metadata("design:type", String)
], Report.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ReportStatus, default: ReportStatus.DRAFT }),
    __metadata("design:type", String)
], Report.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], enum: ReportFormat, default: [ReportFormat.PDF] }),
    __metadata("design:type", Array)
], Report.prototype, "formats", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Report.prototype, "dataSource", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object] }),
    __metadata("design:type", Array)
], Report.prototype, "filters", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object] }),
    __metadata("design:type", Array)
], Report.prototype, "columns", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Report.prototype, "sorting", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Report.prototype, "grouping", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Report.prototype, "scheduleConfig", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Report.prototype, "styling", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Report.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Organization' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Report.prototype, "organizationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Report.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Report.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Report.prototype, "updatedAt", void 0);
exports.Report = Report = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'reports' })
], Report);
exports.ReportSchema = mongoose_1.SchemaFactory.createForClass(Report);
exports.ReportSchema.index({ organizationId: 1, status: 1 });
exports.ReportSchema.index({ type: 1, status: 1 });
exports.ReportSchema.index({ createdAt: -1 });
//# sourceMappingURL=report.schema.js.map