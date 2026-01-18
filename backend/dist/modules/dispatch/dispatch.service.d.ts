import { Repository } from 'typeorm';
import { Job } from '../../database/entities/job.entity';
import { Worker } from '../../database/entities/worker.entity';
import { AssignJobDto } from './dto/assign-job.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';
import { FilterJobDto } from './dto/filter-job.dto';
export declare class DispatchService {
    private jobsRepository;
    private workersRepository;
    constructor(jobsRepository: Repository<Job>, workersRepository: Repository<Worker>);
    findAllJobs(filterDto: FilterJobDto): Promise<{
        data: Job[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findJob(id: string): Promise<Job>;
    assignJob(jobId: string, assignDto: AssignJobDto): Promise<Job>;
    unassignJob(jobId: string): Promise<Job>;
    updateJobStatus(jobId: string, updateDto: UpdateJobStatusDto): Promise<Job>;
    findAllWorkers(): Promise<Worker[]>;
    findAvailableWorkers(): Promise<Worker[]>;
    findWorker(id: string): Promise<Worker>;
    updateWorkerLocation(workerId: string, locationDto: UpdateLocationDto): Promise<Worker>;
    getWorkerCurrentJob(workerId: string): Promise<Job | null>;
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
    findNearestWorkers(lat: number, lng: number, limit?: number): Promise<Worker[]>;
    private calculateDistance;
    private deg2rad;
}
