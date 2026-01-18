import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FilterProjectDto } from './dto/filter-project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: CreateProjectDto): Promise<import("../../database/entities/project.entity").Project>;
    findAll(filterDto: FilterProjectDto): Promise<{
        data: import("../../database/entities/project.entity").Project[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("../../database/entities/project.entity").Project>;
    update(id: string, updateProjectDto: UpdateProjectDto): Promise<import("../../database/entities/project.entity").Project>;
    remove(id: string): Promise<void>;
    updateProgress(id: string, progress: number): Promise<import("../../database/entities/project.entity").Project>;
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
