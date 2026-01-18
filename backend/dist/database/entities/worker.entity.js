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
exports.Worker = exports.WorkerStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const job_entity_1 = require("./job.entity");
var WorkerStatus;
(function (WorkerStatus) {
    WorkerStatus["AVAILABLE"] = "available";
    WorkerStatus["ON_ROUTE"] = "on-route";
    WorkerStatus["ON_SITE"] = "on-site";
    WorkerStatus["OFFLINE"] = "offline";
})(WorkerStatus || (exports.WorkerStatus = WorkerStatus = {}));
let Worker = class Worker {
    id;
    userId;
    user;
    status;
    currentJobId;
    currentLocation;
    skills;
    certifications;
    metadata;
    jobs;
    createdAt;
    updatedAt;
};
exports.Worker = Worker;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Worker.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Worker.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Worker.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: WorkerStatus,
        default: WorkerStatus.OFFLINE,
    }),
    __metadata("design:type", String)
], Worker.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Worker.prototype, "currentJobId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "currentLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, default: [] }),
    __metadata("design:type", Array)
], Worker.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "certifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => job_entity_1.Job, (job) => job.assignedWorker),
    __metadata("design:type", Array)
], Worker.prototype, "jobs", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Worker.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Worker.prototype, "updatedAt", void 0);
exports.Worker = Worker = __decorate([
    (0, typeorm_1.Entity)('workers')
], Worker);
//# sourceMappingURL=worker.entity.js.map