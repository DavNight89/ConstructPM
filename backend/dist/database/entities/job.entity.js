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
exports.Job = exports.JobPriority = exports.JobStatus = void 0;
const typeorm_1 = require("typeorm");
const project_entity_1 = require("./project.entity");
const worker_entity_1 = require("./worker.entity");
var JobStatus;
(function (JobStatus) {
    JobStatus["PENDING"] = "pending";
    JobStatus["ASSIGNED"] = "assigned";
    JobStatus["IN_PROGRESS"] = "in-progress";
    JobStatus["COMPLETED"] = "completed";
    JobStatus["CANCELLED"] = "cancelled";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
var JobPriority;
(function (JobPriority) {
    JobPriority["LOW"] = "low";
    JobPriority["MEDIUM"] = "medium";
    JobPriority["HIGH"] = "high";
})(JobPriority || (exports.JobPriority = JobPriority = {}));
let Job = class Job {
    id;
    jobNumber;
    projectId;
    project;
    assignedWorkerId;
    assignedWorker;
    title;
    description;
    status;
    priority;
    scheduledTime;
    startedAt;
    completedAt;
    location;
    estimatedDuration;
    actualDuration;
    metadata;
    createdAt;
    updatedAt;
};
exports.Job = Job;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Job.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Job.prototype, "jobNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Job.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.Project, (project) => project.jobs),
    (0, typeorm_1.JoinColumn)({ name: 'projectId' }),
    __metadata("design:type", project_entity_1.Project)
], Job.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "assignedWorkerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => worker_entity_1.Worker, (worker) => worker.jobs, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assignedWorkerId' }),
    __metadata("design:type", worker_entity_1.Worker)
], Job.prototype, "assignedWorker", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Job.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: JobStatus,
        default: JobStatus.PENDING,
    }),
    __metadata("design:type", String)
], Job.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: JobPriority,
        default: JobPriority.MEDIUM,
    }),
    __metadata("design:type", String)
], Job.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Job.prototype, "scheduledTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Job.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Job.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Job.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Job.prototype, "estimatedDuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Job.prototype, "actualDuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Job.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Job.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Job.prototype, "updatedAt", void 0);
exports.Job = Job = __decorate([
    (0, typeorm_1.Entity)('jobs')
], Job);
//# sourceMappingURL=job.entity.js.map