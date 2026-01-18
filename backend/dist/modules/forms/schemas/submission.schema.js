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
exports.SubmissionSchema = exports.Submission = exports.SubmissionStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var SubmissionStatus;
(function (SubmissionStatus) {
    SubmissionStatus["SUBMITTED"] = "submitted";
    SubmissionStatus["APPROVED"] = "approved";
    SubmissionStatus["REJECTED"] = "rejected";
})(SubmissionStatus || (exports.SubmissionStatus = SubmissionStatus = {}));
let Submission = class Submission {
    formId;
    formVersion;
    projectId;
    workerId;
    jobId;
    data;
    metadata;
    status;
    approvals;
};
exports.Submission = Submission;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Submission.prototype, "formId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Submission.prototype, "formVersion", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Submission.prototype, "projectId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Submission.prototype, "workerId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Submission.prototype, "jobId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], Submission.prototype, "data", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Submission.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: SubmissionStatus, default: SubmissionStatus.SUBMITTED }),
    __metadata("design:type", String)
], Submission.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], Submission.prototype, "approvals", void 0);
exports.Submission = Submission = __decorate([
    (0, mongoose_1.Schema)({ collection: 'form_submissions', timestamps: true })
], Submission);
exports.SubmissionSchema = mongoose_1.SchemaFactory.createForClass(Submission);
//# sourceMappingURL=submission.schema.js.map