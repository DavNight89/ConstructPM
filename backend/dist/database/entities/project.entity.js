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
exports.Project = exports.ProjectPriority = exports.ProjectStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const job_entity_1 = require("./job.entity");
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["PLANNING"] = "planning";
    ProjectStatus["IN_PROGRESS"] = "in-progress";
    ProjectStatus["COMPLETED"] = "completed";
    ProjectStatus["ON_HOLD"] = "on-hold";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
var ProjectPriority;
(function (ProjectPriority) {
    ProjectPriority["LOW"] = "low";
    ProjectPriority["MEDIUM"] = "medium";
    ProjectPriority["HIGH"] = "high";
})(ProjectPriority || (exports.ProjectPriority = ProjectPriority = {}));
let Project = class Project {
    id;
    name;
    description;
    clientId;
    client;
    managerId;
    manager;
    status;
    progress;
    budget;
    spent;
    startDate;
    endDate;
    location;
    priority;
    metadata;
    jobs;
    createdAt;
    updatedAt;
};
exports.Project = Project;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Project.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'clientId' }),
    __metadata("design:type", user_entity_1.User)
], Project.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "managerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.managedProjects, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'managerId' }),
    __metadata("design:type", user_entity_1.User)
], Project.prototype, "manager", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ProjectStatus,
        default: ProjectStatus.PLANNING,
    }),
    __metadata("design:type", String)
], Project.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Project.prototype, "progress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Project.prototype, "budget", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Project.prototype, "spent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Project.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Project.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Project.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ProjectPriority,
        default: ProjectPriority.MEDIUM,
    }),
    __metadata("design:type", String)
], Project.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Project.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => job_entity_1.Job, (job) => job.project),
    __metadata("design:type", Array)
], Project.prototype, "jobs", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Project.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Project.prototype, "updatedAt", void 0);
exports.Project = Project = __decorate([
    (0, typeorm_1.Entity)('projects')
], Project);
//# sourceMappingURL=project.entity.js.map