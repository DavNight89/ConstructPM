import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FilterProjectDto } from './dto/filter-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Projects')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query() filterDto: FilterProjectDto) {
    return this.projectsService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single project by ID' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a project' })
  @ApiResponse({ status: 204, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Patch(':id/progress')
  @ApiOperation({ summary: 'Update project progress percentage' })
  @ApiResponse({ status: 200, description: 'Progress updated successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 400, description: 'Invalid progress value' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateProgress(
    @Param('id') id: string,
    @Body('progress') progress: number,
  ) {
    return this.projectsService.updateProgress(id, progress);
  }

  @Get(':id/jobs')
  @ApiOperation({ summary: 'Get all jobs for a project' })
  @ApiResponse({ status: 200, description: 'Jobs retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProjectJobs(@Param('id') id: string) {
    return this.projectsService.getProjectJobs(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get project statistics (budget, progress, timeline)' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProjectStats(@Param('id') id: string) {
    return this.projectsService.getProjectStats(id);
  }
}
