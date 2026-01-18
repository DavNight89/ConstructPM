import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../database/entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FilterProjectDto } from './dto/filter-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    // Validate dates
    const startDate = new Date(createProjectDto.startDate);
    const endDate = new Date(createProjectDto.endDate);

    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    const project = this.projectsRepository.create({
      ...createProjectDto,
      spent: createProjectDto.spent || 0,
      progress: createProjectDto.progress || 0,
      status: createProjectDto.status || ('planning' as any),
      priority: createProjectDto.priority || ('medium' as any),
    });

    return this.projectsRepository.save(project);
  }

  async findAll(filterDto: FilterProjectDto) {
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
      queryBuilder.andWhere(
        '(project.name ILIKE :search OR project.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Add relations
    queryBuilder.leftJoinAndSelect('project.manager', 'manager');
    queryBuilder.leftJoinAndSelect('project.jobs', 'jobs');

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Order by creation date (newest first)
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

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['manager', 'jobs', 'jobs.assignedWorker'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);

    // Validate dates if both are being updated
    if (updateProjectDto.startDate || updateProjectDto.endDate) {
      const startDate = new Date(updateProjectDto.startDate || project.startDate);
      const endDate = new Date(updateProjectDto.endDate || project.endDate);

      if (endDate <= startDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    // Validate budget and spent
    if (updateProjectDto.spent !== undefined && updateProjectDto.spent < 0) {
      throw new BadRequestException('Spent amount cannot be negative');
    }

    if (updateProjectDto.progress !== undefined) {
      if (updateProjectDto.progress < 0 || updateProjectDto.progress > 100) {
        throw new BadRequestException('Progress must be between 0 and 100');
      }
    }

    Object.assign(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    await this.projectsRepository.remove(project);
  }

  async updateProgress(id: string, progress: number): Promise<Project> {
    if (progress < 0 || progress > 100) {
      throw new BadRequestException('Progress must be between 0 and 100');
    }

    const project = await this.findOne(id);
    project.progress = progress;

    // Auto-update status based on progress
    if (progress === 0) {
      project.status = 'planning' as any;
    } else if (progress === 100) {
      project.status = 'completed' as any;
    } else if (project.status === 'planning' || project.status === 'completed') {
      project.status = 'active' as any;
    }

    return this.projectsRepository.save(project);
  }

  async getProjectJobs(id: string) {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['jobs', 'jobs.assignedWorker'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project.jobs;
  }

  async getProjectStats(id: string) {
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
}
