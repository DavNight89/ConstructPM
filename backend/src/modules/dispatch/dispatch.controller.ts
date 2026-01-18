import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DispatchService } from './dispatch.service';
import { DispatchGateway } from './dispatch.gateway';
import { AssignJobDto } from './dto/assign-job.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';
import { FilterJobDto } from './dto/filter-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Dispatch')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dispatch')
export class DispatchController {
  constructor(
    private readonly dispatchService: DispatchService,
    private readonly dispatchGateway: DispatchGateway,
  ) {}

  // Job Endpoints
  @Get('jobs')
  @ApiOperation({ summary: 'Get all jobs with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Jobs retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllJobs(@Query() filterDto: FilterJobDto) {
    return this.dispatchService.findAllJobs(filterDto);
  }

  @Get('jobs/:id')
  @ApiOperation({ summary: 'Get a single job by ID' })
  @ApiResponse({ status: 200, description: 'Job retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findJob(@Param('id') id: string) {
    return this.dispatchService.findJob(id);
  }

  @Post('jobs/:id/assign')
  @ApiOperation({ summary: 'Assign a job to a worker' })
  @ApiResponse({ status: 200, description: 'Job assigned successfully' })
  @ApiResponse({ status: 404, description: 'Job or worker not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Worker already assigned to another job' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async assignJob(@Param('id') id: string, @Body() assignDto: AssignJobDto) {
    const job = await this.dispatchService.assignJob(id, assignDto);

    // Notify via WebSocket
    this.dispatchGateway.notifyJobAssignment(assignDto.workerId, job);

    return job;
  }

  @Delete('jobs/:id/assign')
  @ApiOperation({ summary: 'Unassign a job from a worker' })
  @ApiResponse({ status: 200, description: 'Job unassigned successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @ApiResponse({ status: 400, description: 'Job is not assigned or in progress' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async unassignJob(@Param('id') id: string) {
    const job = await this.dispatchService.findJob(id);
    const workerId = job.assignedWorkerId;

    const updatedJob = await this.dispatchService.unassignJob(id);

    // Notify via WebSocket
    if (workerId) {
      this.dispatchGateway.notifyJobUnassigned(workerId, id);
    }

    return updatedJob;
  }

  @Patch('jobs/:id/status')
  @ApiOperation({ summary: 'Update job status' })
  @ApiResponse({ status: 200, description: 'Job status updated successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateJobStatus(@Param('id') id: string, @Body() updateDto: UpdateJobStatusDto) {
    const job = await this.dispatchService.updateJobStatus(id, updateDto);

    // Notify via WebSocket
    this.dispatchGateway.broadcastJobUpdate(id, { status: updateDto.status });

    return job;
  }

  // Worker Endpoints
  @Get('workers')
  @ApiOperation({ summary: 'Get all workers' })
  @ApiResponse({ status: 200, description: 'Workers retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllWorkers() {
    return this.dispatchService.findAllWorkers();
  }

  @Get('workers/available')
  @ApiOperation({ summary: 'Get all available workers' })
  @ApiResponse({ status: 200, description: 'Available workers retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAvailableWorkers() {
    return this.dispatchService.findAvailableWorkers();
  }

  @Get('workers/:id')
  @ApiOperation({ summary: 'Get a worker by ID' })
  @ApiResponse({ status: 200, description: 'Worker retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Worker not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findWorker(@Param('id') id: string) {
    return this.dispatchService.findWorker(id);
  }

  @Patch('workers/:id/location')
  @ApiOperation({ summary: 'Update worker GPS location' })
  @ApiResponse({ status: 200, description: 'Worker location updated successfully' })
  @ApiResponse({ status: 404, description: 'Worker not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateWorkerLocation(@Param('id') id: string, @Body() locationDto: UpdateLocationDto) {
    const worker = await this.dispatchService.updateWorkerLocation(id, locationDto);

    // Notify via WebSocket
    this.dispatchGateway.broadcastWorkerUpdate(id, {
      location: worker.currentLocation,
    });

    return worker;
  }

  @Get('workers/:id/current-job')
  @ApiOperation({ summary: 'Get worker current job' })
  @ApiResponse({ status: 200, description: 'Current job retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Worker not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getWorkerCurrentJob(@Param('id') id: string) {
    return this.dispatchService.getWorkerCurrentJob(id);
  }

  @Get('workers/nearest/:lat/:lng')
  @ApiOperation({ summary: 'Find nearest available workers to a location' })
  @ApiResponse({ status: 200, description: 'Nearest workers found successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findNearestWorkers(
    @Param('lat') lat: string,
    @Param('lng') lng: string,
    @Query('limit') limit?: string,
  ) {
    return this.dispatchService.findNearestWorkers(
      parseFloat(lat),
      parseFloat(lng),
      limit ? parseInt(limit, 10) : 5,
    );
  }

  // Analytics
  @Get('stats')
  @ApiOperation({ summary: 'Get dispatch statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getDispatchStats() {
    return this.dispatchService.getDispatchStats();
  }
}
