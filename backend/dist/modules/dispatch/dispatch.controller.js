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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dispatch_service_1 = require("./dispatch.service");
const dispatch_gateway_1 = require("./dispatch.gateway");
const assign_job_dto_1 = require("./dto/assign-job.dto");
const update_location_dto_1 = require("./dto/update-location.dto");
const update_job_status_dto_1 = require("./dto/update-job-status.dto");
const filter_job_dto_1 = require("./dto/filter-job.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let DispatchController = class DispatchController {
    dispatchService;
    dispatchGateway;
    constructor(dispatchService, dispatchGateway) {
        this.dispatchService = dispatchService;
        this.dispatchGateway = dispatchGateway;
    }
    findAllJobs(filterDto) {
        return this.dispatchService.findAllJobs(filterDto);
    }
    findJob(id) {
        return this.dispatchService.findJob(id);
    }
    async assignJob(id, assignDto) {
        const job = await this.dispatchService.assignJob(id, assignDto);
        this.dispatchGateway.notifyJobAssignment(assignDto.workerId, job);
        return job;
    }
    async unassignJob(id) {
        const job = await this.dispatchService.findJob(id);
        const workerId = job.assignedWorkerId;
        const updatedJob = await this.dispatchService.unassignJob(id);
        if (workerId) {
            this.dispatchGateway.notifyJobUnassigned(workerId, id);
        }
        return updatedJob;
    }
    async updateJobStatus(id, updateDto) {
        const job = await this.dispatchService.updateJobStatus(id, updateDto);
        this.dispatchGateway.broadcastJobUpdate(id, { status: updateDto.status });
        return job;
    }
    findAllWorkers() {
        return this.dispatchService.findAllWorkers();
    }
    findAvailableWorkers() {
        return this.dispatchService.findAvailableWorkers();
    }
    findWorker(id) {
        return this.dispatchService.findWorker(id);
    }
    async updateWorkerLocation(id, locationDto) {
        const worker = await this.dispatchService.updateWorkerLocation(id, locationDto);
        this.dispatchGateway.broadcastWorkerUpdate(id, {
            location: worker.currentLocation,
        });
        return worker;
    }
    getWorkerCurrentJob(id) {
        return this.dispatchService.getWorkerCurrentJob(id);
    }
    findNearestWorkers(lat, lng, limit) {
        return this.dispatchService.findNearestWorkers(parseFloat(lat), parseFloat(lng), limit ? parseInt(limit, 10) : 5);
    }
    getDispatchStats() {
        return this.dispatchService.getDispatchStats();
    }
};
exports.DispatchController = DispatchController;
__decorate([
    (0, common_1.Get)('jobs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all jobs with filters and pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Jobs retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_job_dto_1.FilterJobDto]),
    __metadata("design:returntype", void 0)
], DispatchController.prototype, "findAllJobs", null);
__decorate([
    (0, common_1.Get)('jobs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single job by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Job retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DispatchController.prototype, "findJob", null);
__decorate([
    (0, common_1.Post)('jobs/:id/assign'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign a job to a worker' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Job assigned successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job or worker not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Worker already assigned to another job' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_job_dto_1.AssignJobDto]),
    __metadata("design:returntype", Promise)
], DispatchController.prototype, "assignJob", null);
__decorate([
    (0, common_1.Delete)('jobs/:id/assign'),
    (0, swagger_1.ApiOperation)({ summary: 'Unassign a job from a worker' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Job unassigned successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Job is not assigned or in progress' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DispatchController.prototype, "unassignJob", null);
__decorate([
    (0, common_1.Patch)('jobs/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update job status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Job status updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid status transition' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_job_status_dto_1.UpdateJobStatusDto]),
    __metadata("design:returntype", Promise)
], DispatchController.prototype, "updateJobStatus", null);
__decorate([
    (0, common_1.Get)('workers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all workers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workers retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DispatchController.prototype, "findAllWorkers", null);
__decorate([
    (0, common_1.Get)('workers/available'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available workers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Available workers retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DispatchController.prototype, "findAvailableWorkers", null);
__decorate([
    (0, common_1.Get)('workers/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a worker by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Worker retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Worker not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DispatchController.prototype, "findWorker", null);
__decorate([
    (0, common_1.Patch)('workers/:id/location'),
    (0, swagger_1.ApiOperation)({ summary: 'Update worker GPS location' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Worker location updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Worker not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_location_dto_1.UpdateLocationDto]),
    __metadata("design:returntype", Promise)
], DispatchController.prototype, "updateWorkerLocation", null);
__decorate([
    (0, common_1.Get)('workers/:id/current-job'),
    (0, swagger_1.ApiOperation)({ summary: 'Get worker current job' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current job retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Worker not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DispatchController.prototype, "getWorkerCurrentJob", null);
__decorate([
    (0, common_1.Get)('workers/nearest/:lat/:lng'),
    (0, swagger_1.ApiOperation)({ summary: 'Find nearest available workers to a location' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nearest workers found successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('lat')),
    __param(1, (0, common_1.Param)('lng')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], DispatchController.prototype, "findNearestWorkers", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dispatch statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DispatchController.prototype, "getDispatchStats", null);
exports.DispatchController = DispatchController = __decorate([
    (0, swagger_1.ApiTags)('Dispatch'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('dispatch'),
    __metadata("design:paramtypes", [dispatch_service_1.DispatchService,
        dispatch_gateway_1.DispatchGateway])
], DispatchController);
//# sourceMappingURL=dispatch.controller.js.map