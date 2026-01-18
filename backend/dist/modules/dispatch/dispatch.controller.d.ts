import { DispatchService } from './dispatch.service';
import { DispatchGateway } from './dispatch.gateway';
import { AssignJobDto } from './dto/assign-job.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';
import { FilterJobDto } from './dto/filter-job.dto';
export declare class DispatchController {
    private readonly dispatchService;
    private readonly dispatchGateway;
    constructor(dispatchService: DispatchService, dispatchGateway: DispatchGateway);
    findAllJobs(filterDto: FilterJobDto): Promise<{
        data: import("../../database/entities/job.entity").Job[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findJob(id: string): Promise<import("../../database/entities/job.entity").Job>;
    assignJob(id: string, assignDto: AssignJobDto): Promise<import("../../database/entities/job.entity").Job>;
    unassignJob(id: string): Promise<import("../../database/entities/job.entity").Job>;
    updateJobStatus(id: string, updateDto: UpdateJobStatusDto): Promise<import("../../database/entities/job.entity").Job>;
    findAllWorkers(): Promise<import("../../database/entities/worker.entity").Worker[]>;
    findAvailableWorkers(): Promise<import("../../database/entities/worker.entity").Worker[]>;
    findWorker(id: string): Promise<import("../../database/entities/worker.entity").Worker>;
    updateWorkerLocation(id: string, locationDto: UpdateLocationDto): Promise<import("../../database/entities/worker.entity").Worker>;
    getWorkerCurrentJob(id: string): Promise<import("../../database/entities/job.entity").Job | null>;
    findNearestWorkers(lat: string, lng: string, limit?: string): Promise<import("../../database/entities/worker.entity").Worker[]>;
    getDispatchStats(): Promise<{
        jobs: {
            total: number;
            pending: number;
            assigned: number;
            inProgress: number;
            completed: number;
        };
        workers: {
            total: number;
            available: number;
            busy: number;
            offline: number;
        };
    }>;
}
