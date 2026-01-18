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
exports.DispatchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_entity_1 = require("../../database/entities/job.entity");
const worker_entity_1 = require("../../database/entities/worker.entity");
let DispatchService = class DispatchService {
    jobsRepository;
    workersRepository;
    constructor(jobsRepository, workersRepository) {
        this.jobsRepository = jobsRepository;
        this.workersRepository = workersRepository;
    }
    async findAllJobs(filterDto) {
        const { status, priority, projectId, workerId, search, page = 1, limit = 10 } = filterDto;
        const queryBuilder = this.jobsRepository.createQueryBuilder('job');
        if (status) {
            queryBuilder.andWhere('job.status = :status', { status });
        }
        if (priority) {
            queryBuilder.andWhere('job.priority = :priority', { priority });
        }
        if (projectId) {
            queryBuilder.andWhere('job.projectId = :projectId', { projectId });
        }
        if (workerId) {
            queryBuilder.andWhere('job.assignedWorkerId = :workerId', { workerId });
        }
        if (search) {
            queryBuilder.andWhere('(job.title ILIKE :search OR job.description ILIKE :search)', { search: `%${search}%` });
        }
        queryBuilder.leftJoinAndSelect('job.project', 'project');
        queryBuilder.leftJoinAndSelect('job.assignedWorker', 'worker');
        queryBuilder.leftJoinAndSelect('worker.user', 'user');
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        queryBuilder.orderBy('job.priority', 'DESC');
        queryBuilder.addOrderBy('job.scheduledTime', 'ASC');
        const [jobs, total] = await queryBuilder.getManyAndCount();
        return {
            data: jobs,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findJob(id) {
        const job = await this.jobsRepository.findOne({
            where: { id },
            relations: ['project', 'assignedWorker', 'assignedWorker.user'],
        });
        if (!job) {
            throw new common_1.NotFoundException(`Job with ID ${id} not found`);
        }
        return job;
    }
    async assignJob(jobId, assignDto) {
        const job = await this.findJob(jobId);
        const worker = await this.workersRepository.findOne({
            where: { id: assignDto.workerId },
            relations: ['user'],
        });
        if (!worker) {
            throw new common_1.NotFoundException(`Worker with ID ${assignDto.workerId} not found`);
        }
        if (worker.status === worker_entity_1.WorkerStatus.OFFLINE) {
            throw new common_1.BadRequestException('Worker is offline and cannot be assigned jobs');
        }
        if (worker.currentJobId && worker.currentJobId !== jobId) {
            const currentJob = await this.jobsRepository.findOne({
                where: { id: worker.currentJobId },
            });
            if (currentJob && currentJob.status === job_entity_1.JobStatus.IN_PROGRESS) {
                throw new common_1.ConflictException(`Worker is already assigned to job ${currentJob.jobNumber} which is in progress`);
            }
        }
        job.assignedWorkerId = worker.id;
        job.status = job_entity_1.JobStatus.ASSIGNED;
        worker.currentJobId = jobId;
        worker.status = worker_entity_1.WorkerStatus.ON_ROUTE;
        await this.workersRepository.save(worker);
        return this.jobsRepository.save(job);
    }
    async unassignJob(jobId) {
        const job = await this.findJob(jobId);
        if (!job.assignedWorkerId) {
            throw new common_1.BadRequestException('Job is not assigned to any worker');
        }
        if (job.status === job_entity_1.JobStatus.IN_PROGRESS) {
            throw new common_1.BadRequestException('Cannot unassign a job that is in progress');
        }
        const worker = await this.workersRepository.findOne({
            where: { id: job.assignedWorkerId },
        });
        if (worker) {
            worker.currentJobId = null;
            worker.status = worker_entity_1.WorkerStatus.AVAILABLE;
            await this.workersRepository.save(worker);
        }
        job.assignedWorkerId = null;
        job.status = job_entity_1.JobStatus.PENDING;
        return this.jobsRepository.save(job);
    }
    async updateJobStatus(jobId, updateDto) {
        const job = await this.findJob(jobId);
        if (updateDto.status === job_entity_1.JobStatus.IN_PROGRESS && !job.assignedWorkerId) {
            throw new common_1.BadRequestException('Cannot start a job that is not assigned to a worker');
        }
        if (updateDto.status === job_entity_1.JobStatus.IN_PROGRESS && !job.startedAt) {
            job.startedAt = new Date();
        }
        if (updateDto.status === job_entity_1.JobStatus.COMPLETED && !job.completedAt) {
            job.completedAt = new Date();
            if (job.startedAt) {
                const duration = Math.floor((job.completedAt.getTime() - job.startedAt.getTime()) / (1000 * 60));
                job.actualDuration = duration;
            }
            if (job.assignedWorkerId) {
                const worker = await this.workersRepository.findOne({
                    where: { id: job.assignedWorkerId },
                });
                if (worker) {
                    worker.currentJobId = null;
                    worker.status = worker_entity_1.WorkerStatus.AVAILABLE;
                    await this.workersRepository.save(worker);
                }
            }
        }
        job.status = updateDto.status;
        if (job.assignedWorkerId) {
            const worker = await this.workersRepository.findOne({
                where: { id: job.assignedWorkerId },
            });
            if (worker) {
                if (updateDto.status === job_entity_1.JobStatus.IN_PROGRESS) {
                    worker.status = worker_entity_1.WorkerStatus.ON_SITE;
                }
                else if (updateDto.status === job_entity_1.JobStatus.ASSIGNED) {
                    worker.status = worker_entity_1.WorkerStatus.ON_ROUTE;
                }
                await this.workersRepository.save(worker);
            }
        }
        return this.jobsRepository.save(job);
    }
    async findAllWorkers() {
        return this.workersRepository.find({
            relations: ['user'],
            order: { status: 'ASC' },
        });
    }
    async findAvailableWorkers() {
        return this.workersRepository.find({
            where: [
                { status: worker_entity_1.WorkerStatus.AVAILABLE },
                { status: worker_entity_1.WorkerStatus.ON_ROUTE },
                { status: worker_entity_1.WorkerStatus.ON_SITE },
            ],
            relations: ['user'],
            order: { status: 'ASC' },
        });
    }
    async findWorker(id) {
        const worker = await this.workersRepository.findOne({
            where: { id },
            relations: ['user', 'jobs'],
        });
        if (!worker) {
            throw new common_1.NotFoundException(`Worker with ID ${id} not found`);
        }
        return worker;
    }
    async updateWorkerLocation(workerId, locationDto) {
        const worker = await this.findWorker(workerId);
        worker.currentLocation = {
            lat: locationDto.lat,
            lng: locationDto.lng,
            timestamp: new Date(),
        };
        return this.workersRepository.save(worker);
    }
    async getWorkerCurrentJob(workerId) {
        const worker = await this.findWorker(workerId);
        if (!worker.currentJobId) {
            return null;
        }
        return this.jobsRepository.findOne({
            where: { id: worker.currentJobId },
            relations: ['project'],
        });
    }
    async getDispatchStats() {
        const [totalJobs, pendingJobs, assignedJobs, inProgressJobs, completedJobs, totalWorkers, availableWorkers, busyWorkers,] = await Promise.all([
            this.jobsRepository.count(),
            this.jobsRepository.count({ where: { status: job_entity_1.JobStatus.PENDING } }),
            this.jobsRepository.count({ where: { status: job_entity_1.JobStatus.ASSIGNED } }),
            this.jobsRepository.count({ where: { status: job_entity_1.JobStatus.IN_PROGRESS } }),
            this.jobsRepository.count({ where: { status: job_entity_1.JobStatus.COMPLETED } }),
            this.workersRepository.count(),
            this.workersRepository.count({ where: { status: worker_entity_1.WorkerStatus.AVAILABLE } }),
            this.workersRepository.count({
                where: [
                    { status: worker_entity_1.WorkerStatus.ON_ROUTE },
                    { status: worker_entity_1.WorkerStatus.ON_SITE },
                ],
            }),
        ]);
        return {
            jobs: {
                total: totalJobs,
                pending: pendingJobs,
                assigned: assignedJobs,
                inProgress: inProgressJobs,
                completed: completedJobs,
            },
            workers: {
                total: totalWorkers,
                available: availableWorkers,
                busy: busyWorkers,
                offline: totalWorkers - availableWorkers - busyWorkers,
            },
        };
    }
    async findNearestWorkers(lat, lng, limit = 5) {
        const workers = await this.workersRepository.find({
            where: [
                { status: worker_entity_1.WorkerStatus.AVAILABLE },
                { status: worker_entity_1.WorkerStatus.ON_ROUTE },
            ],
            relations: ['user'],
        });
        const workersWithDistance = workers
            .filter((w) => w.currentLocation?.lat && w.currentLocation?.lng)
            .map((worker) => {
            const distance = this.calculateDistance(lat, lng, worker.currentLocation.lat, worker.currentLocation.lng);
            return { worker, distance };
        })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, limit);
        return workersWithDistance.map((w) => w.worker);
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) *
                Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
};
exports.DispatchService = DispatchService;
exports.DispatchService = DispatchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(1, (0, typeorm_1.InjectRepository)(worker_entity_1.Worker)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DispatchService);
//# sourceMappingURL=dispatch.service.js.map