import { Repository } from 'typeorm';
import { Project } from '../../database/entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FilterProjectDto } from './dto/filter-project.dto';
export declare class ProjectsService {
    private projectsRepository;
    constructor(projectsRepository: Repository<Project>);
    create(createProjectDto: CreateProjectDto): Promise<Project>;
    findAll(filterDto: FilterProjectDto): Promise<{
        data: Project[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Project>;
    update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project>;
    remove(id: string): Promise<void>;
    updateProgress(id: string, progress: number): Promise<Project>;
    getProjectJobs(id: string): Promise<import("../../database/entities/job.entity").Job[]>;
    getProjectStats(id: string): Promise<{
        projectId: string;
        projectName: string;
        budget: {
            total: number;
            spent: number;
            remaining: number;
            percentage: number;
        };
        progress: {
            percentage: number;
            status: import("../../database/entities/project.entity").ProjectStatus;
        };
        timeline: {
            startDate: Date;
            endDate: Date;
            daysRemaining: number;
            timeElapsedPercentage: number;
        };
        jobs: {
            total: number;
        };
    }>;
}
