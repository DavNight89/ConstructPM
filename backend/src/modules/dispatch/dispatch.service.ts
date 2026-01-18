import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job, JobStatus } from '../../database/entities/job.entity';
import { Worker, WorkerStatus } from '../../database/entities/worker.entity';
import { AssignJobDto } from './dto/assign-job.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';
import { FilterJobDto } from './dto/filter-job.dto';

@Injectable()
export class DispatchService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    @InjectRepository(Worker)
    private workersRepository: Repository<Worker>,
  ) {}

  // Job Management
  async findAllJobs(filterDto: FilterJobDto) {
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
      queryBuilder.andWhere(
        '(job.title ILIKE :search OR job.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Add relations
    queryBuilder.leftJoinAndSelect('job.project', 'project');
    queryBuilder.leftJoinAndSelect('job.assignedWorker', 'worker');
    queryBuilder.leftJoinAndSelect('worker.user', 'user');

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Order by priority and scheduled time
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

  async findJob(id: string): Promise<Job> {
    const job = await this.jobsRepository.findOne({
      where: { id },
      relations: ['project', 'assignedWorker', 'assignedWorker.user'],
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return job;
  }

  async assignJob(jobId: string, assignDto: AssignJobDto): Promise<Job> {
    const job = await this.findJob(jobId);
    const worker = await this.workersRepository.findOne({
      where: { id: assignDto.workerId },
      relations: ['user'],
    });

    if (!worker) {
      throw new NotFoundException(`Worker with ID ${assignDto.workerId} not found`);
    }

    // Check if worker is available
    if (worker.status === WorkerStatus.OFFLINE) {
      throw new BadRequestException('Worker is offline and cannot be assigned jobs');
    }

    // Check if worker already has a current job
    if (worker.currentJobId && worker.currentJobId !== jobId) {
      const currentJob = await this.jobsRepository.findOne({
        where: { id: worker.currentJobId },
      });

      if (currentJob && currentJob.status === JobStatus.IN_PROGRESS) {
        throw new ConflictException(
          `Worker is already assigned to job ${currentJob.jobNumber} which is in progress`,
        );
      }
    }

    // Assign the job
    job.assignedWorkerId = worker.id;
    job.status = JobStatus.ASSIGNED;

    // Update worker
    worker.currentJobId = jobId;
    worker.status = WorkerStatus.ON_ROUTE;

    await this.workersRepository.save(worker);
    return this.jobsRepository.save(job);
  }

  async unassignJob(jobId: string): Promise<Job> {
    const job = await this.findJob(jobId);

    if (!job.assignedWorkerId) {
      throw new BadRequestException('Job is not assigned to any worker');
    }

    if (job.status === JobStatus.IN_PROGRESS) {
      throw new BadRequestException('Cannot unassign a job that is in progress');
    }

    // Update worker
    const worker = await this.workersRepository.findOne({
      where: { id: job.assignedWorkerId },
    });

    if (worker) {
      worker.currentJobId = null as any;
      worker.status = WorkerStatus.AVAILABLE;
      await this.workersRepository.save(worker);
    }

    // Unassign the job
    job.assignedWorkerId = null as any;
    job.status = JobStatus.PENDING;

    return this.jobsRepository.save(job);
  }

  async updateJobStatus(jobId: string, updateDto: UpdateJobStatusDto): Promise<Job> {
    const job = await this.findJob(jobId);

    // Validate status transitions
    if (updateDto.status === JobStatus.IN_PROGRESS && !job.assignedWorkerId) {
      throw new BadRequestException('Cannot start a job that is not assigned to a worker');
    }

    // Update timestamps based on status
    if (updateDto.status === JobStatus.IN_PROGRESS && !job.startedAt) {
      job.startedAt = new Date();
    }

    if (updateDto.status === JobStatus.COMPLETED && !job.completedAt) {
      job.completedAt = new Date();

      // Calculate actual duration
      if (job.startedAt) {
        const duration = Math.floor(
          (job.completedAt.getTime() - job.startedAt.getTime()) / (1000 * 60),
        );
        job.actualDuration = duration;
      }

      // Update worker status
      if (job.assignedWorkerId) {
        const worker = await this.workersRepository.findOne({
          where: { id: job.assignedWorkerId },
        });

        if (worker) {
          worker.currentJobId = null as any;
          worker.status = WorkerStatus.AVAILABLE;
          await this.workersRepository.save(worker);
        }
      }
    }

    job.status = updateDto.status;

    // Update worker status based on job status
    if (job.assignedWorkerId) {
      const worker = await this.workersRepository.findOne({
        where: { id: job.assignedWorkerId },
      });

      if (worker) {
        if (updateDto.status === JobStatus.IN_PROGRESS) {
          worker.status = WorkerStatus.ON_SITE;
        } else if (updateDto.status === JobStatus.ASSIGNED) {
          worker.status = WorkerStatus.ON_ROUTE;
        }
        await this.workersRepository.save(worker);
      }
    }

    return this.jobsRepository.save(job);
  }

  // Worker Management
  async findAllWorkers() {
    return this.workersRepository.find({
      relations: ['user'],
      order: { status: 'ASC' },
    });
  }

  async findAvailableWorkers() {
    return this.workersRepository.find({
      where: [
        { status: WorkerStatus.AVAILABLE },
        { status: WorkerStatus.ON_ROUTE },
        { status: WorkerStatus.ON_SITE },
      ],
      relations: ['user'],
      order: { status: 'ASC' },
    });
  }

  async findWorker(id: string): Promise<Worker> {
    const worker = await this.workersRepository.findOne({
      where: { id },
      relations: ['user', 'jobs'],
    });

    if (!worker) {
      throw new NotFoundException(`Worker with ID ${id} not found`);
    }

    return worker;
  }

  async updateWorkerLocation(workerId: string, locationDto: UpdateLocationDto): Promise<Worker> {
    const worker = await this.findWorker(workerId);

    worker.currentLocation = {
      lat: locationDto.lat,
      lng: locationDto.lng,
      timestamp: new Date(),
    };

    return this.workersRepository.save(worker);
  }

  async getWorkerCurrentJob(workerId: string): Promise<Job | null> {
    const worker = await this.findWorker(workerId);

    if (!worker.currentJobId) {
      return null;
    }

    return this.jobsRepository.findOne({
      where: { id: worker.currentJobId },
      relations: ['project'],
    });
  }

  // Dispatch Analytics
  async getDispatchStats() {
    const [
      totalJobs,
      pendingJobs,
      assignedJobs,
      inProgressJobs,
      completedJobs,
      totalWorkers,
      availableWorkers,
      busyWorkers,
    ] = await Promise.all([
      this.jobsRepository.count(),
      this.jobsRepository.count({ where: { status: JobStatus.PENDING } }),
      this.jobsRepository.count({ where: { status: JobStatus.ASSIGNED } }),
      this.jobsRepository.count({ where: { status: JobStatus.IN_PROGRESS } }),
      this.jobsRepository.count({ where: { status: JobStatus.COMPLETED } }),
      this.workersRepository.count(),
      this.workersRepository.count({ where: { status: WorkerStatus.AVAILABLE } }),
      this.workersRepository.count({
        where: [
          { status: WorkerStatus.ON_ROUTE },
          { status: WorkerStatus.ON_SITE },
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

  // Find nearest available workers to a location
  async findNearestWorkers(lat: number, lng: number, limit: number = 5): Promise<Worker[]> {
    const workers = await this.workersRepository.find({
      where: [
        { status: WorkerStatus.AVAILABLE },
        { status: WorkerStatus.ON_ROUTE },
      ],
      relations: ['user'],
    });

    // Calculate distance for each worker with a location
    const workersWithDistance = workers
      .filter((w) => w.currentLocation?.lat && w.currentLocation?.lng)
      .map((worker) => {
        const distance = this.calculateDistance(
          lat,
          lng,
          worker.currentLocation.lat,
          worker.currentLocation.lng,
        );
        return { worker, distance };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    return workersWithDistance.map((w) => w.worker);
  }

  // Haversine formula to calculate distance between two coordinates
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
