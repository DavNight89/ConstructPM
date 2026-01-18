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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_entity_1 = require("../../database/entities/project.entity");
let ProjectsService = class ProjectsService {
    projectsRepository;
    constructor(projectsRepository) {
        this.projectsRepository = projectsRepository;
    }
    async create(createProjectDto) {
        const startDate = new Date(createProjectDto.startDate);
        const endDate = new Date(createProjectDto.endDate);
        if (endDate <= startDate) {
            throw new common_1.BadRequestException('End date must be after start date');
        }
        const project = this.projectsRepository.create({
            ...createProjectDto,
            spent: createProjectDto.spent || 0,
            progress: createProjectDto.progress || 0,
            status: createProjectDto.status || 'planning',
            priority: createProjectDto.priority || 'medium',
        });
        return this.projectsRepository.save(project);
    }
    async findAll(filterDto) {
        const { status, priority, managerId, search, page = 1, limit = 10 } = filterDto;
        const queryBuilder = this.projectsRepository.createQueryBuilder('project');
        if (status) {
            queryBuilder.andWhere('project.status = :status', { status });
        }
        if (priority) {
            queryBuilder.andWhere('project.priority = :priority', { priority });
        }
        if (managerId) {
            queryBuilder.andWhere('project.managerId = :managerId', { managerId });
        }
        if (search) {
            queryBuilder.andWhere('(project.name ILIKE :search OR project.description ILIKE :search)', { search: `%${search}%` });
        }
        queryBuilder.leftJoinAndSelect('project.manager', 'manager');
        queryBuilder.leftJoinAndSelect('project.jobs', 'jobs');
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        queryBuilder.orderBy('project.createdAt', 'DESC');
        const [projects, total] = await queryBuilder.getManyAndCount();
        return {
            data: projects,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const project = await this.projectsRepository.findOne({
            where: { id },
            relations: ['manager', 'jobs', 'jobs.assignedWorker'],
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
        return project;
    }
    async update(id, updateProjectDto) {
        const project = await this.findOne(id);
        if (updateProjectDto.startDate || updateProjectDto.endDate) {
            const startDate = new Date(updateProjectDto.startDate || project.startDate);
            const endDate = new Date(updateProjectDto.endDate || project.endDate);
            if (endDate <= startDate) {
                throw new common_1.BadRequestException('End date must be after start date');
            }
        }
        if (updateProjectDto.spent !== undefined && updateProjectDto.spent < 0) {
            throw new common_1.BadRequestException('Spent amount cannot be negative');
        }
        if (updateProjectDto.progress !== undefined) {
            if (updateProjectDto.progress < 0 || updateProjectDto.progress > 100) {
                throw new common_1.BadRequestException('Progress must be between 0 and 100');
            }
        }
        Object.assign(project, updateProjectDto);
        return this.projectsRepository.save(project);
    }
    async remove(id) {
        const project = await this.findOne(id);
        await this.projectsRepository.remove(project);
    }
    async updateProgress(id, progress) {
        if (progress < 0 || progress > 100) {
            throw new common_1.BadRequestException('Progress must be between 0 and 100');
        }
        const project = await this.findOne(id);
        project.progress = progress;
        if (progress === 0) {
            project.status = 'planning';
        }
        else if (progress === 100) {
            project.status = 'completed';
        }
        else if (project.status === 'planning' || project.status === 'completed') {
            project.status = 'active';
        }
        return this.projectsRepository.save(project);
    }
    async getProjectJobs(id) {
        const project = await this.projectsRepository.findOne({
            where: { id },
            relations: ['jobs', 'jobs.assignedWorker'],
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
        return project.jobs;
    }
    async getProjectStats(id) {
        const project = await this.findOne(id);
        const budgetUsed = project.spent;
        const budgetRemaining = project.budget - project.spent;
        const budgetPercentage = (project.spent / project.budget) * 100;
        const now = new Date();
        const startDate = new Date(project.startDate);
        const endDate = new Date(project.endDate);
        const totalDuration = endDate.getTime() - startDate.getTime();
        const elapsed = now.getTime() - startDate.getTime();
        const timePercentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
        const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
            projectId: id,
            projectName: project.name,
            budget: {
                total: project.budget,
                spent: budgetUsed,
                remaining: budgetRemaining,
                percentage: Math.round(budgetPercentage * 100) / 100,
            },
            progress: {
                percentage: project.progress,
                status: project.status,
            },
            timeline: {
                startDate: project.startDate,
                endDate: project.endDate,
                daysRemaining,
                timeElapsedPercentage: Math.round(timePercentage * 100) / 100,
            },
            jobs: {
                total: project.jobs?.length || 0,
            },
        };
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map