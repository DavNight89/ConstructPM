import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { FilterFormDto } from './dto/filter-form.dto';
import { FilterSubmissionDto } from './dto/filter-submission.dto';
import { ApproveSubmissionDto } from './dto/approve-submission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Forms')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  // Form Endpoints
  @Post()
  @ApiOperation({ summary: 'Create a new dynamic form' })
  @ApiResponse({ status: 201, description: 'Form created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createForm(@Body() createFormDto: CreateFormDto) {
    return this.formsService.createForm(createFormDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all forms with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Forms retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllForms(@Query() filterDto: FilterFormDto) {
    return this.formsService.findAllForms(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a form by ID' })
  @ApiResponse({ status: 200, description: 'Form retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Form not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findFormById(@Param('id') id: string) {
    return this.formsService.findFormById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a form' })
  @ApiResponse({ status: 200, description: 'Form updated successfully' })
  @ApiResponse({ status: 404, description: 'Form not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateForm(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
    return this.formsService.updateForm(id, updateFormDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a form (only if no submissions)' })
  @ApiResponse({ status: 204, description: 'Form deleted successfully' })
  @ApiResponse({ status: 404, description: 'Form not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete form with submissions' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  deleteForm(@Param('id') id: string) {
    return this.formsService.deleteForm(id);
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate a form' })
  @ApiResponse({ status: 201, description: 'Form duplicated successfully' })
  @ApiResponse({ status: 404, description: 'Form not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  duplicateForm(@Param('id') id: string, @Body('userId') userId: string) {
    return this.formsService.duplicateForm(id, userId);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get form statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Form not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getFormStats(@Param('id') id: string) {
    return this.formsService.getFormStats(id);
  }

  // Submission Endpoints
  @Post('submissions')
  @ApiOperation({ summary: 'Submit a form response' })
  @ApiResponse({ status: 201, description: 'Submission created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createSubmission(@Body() createSubmissionDto: CreateSubmissionDto) {
    return this.formsService.createSubmission(createSubmissionDto);
  }

  @Get('submissions/all')
  @ApiOperation({ summary: 'Get all submissions with filters' })
  @ApiResponse({ status: 200, description: 'Submissions retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllSubmissions(@Query() filterDto: FilterSubmissionDto) {
    return this.formsService.findAllSubmissions(filterDto);
  }

  @Get('submissions/:id')
  @ApiOperation({ summary: 'Get a submission by ID' })
  @ApiResponse({ status: 200, description: 'Submission retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findSubmissionById(@Param('id') id: string) {
    return this.formsService.findSubmissionById(id);
  }

  @Post('submissions/:id/approve')
  @ApiOperation({ summary: 'Approve or reject a submission' })
  @ApiResponse({ status: 200, description: 'Submission status updated' })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  approveSubmission(@Param('id') id: string, @Body() approveDto: ApproveSubmissionDto) {
    return this.formsService.approveSubmission(id, approveDto);
  }

  @Delete('submissions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a submission' })
  @ApiResponse({ status: 204, description: 'Submission deleted successfully' })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  deleteSubmission(@Param('id') id: string) {
    return this.formsService.deleteSubmission(id);
  }

  @Get('submissions/project/:projectId')
  @ApiOperation({ summary: 'Get all submissions for a project' })
  @ApiResponse({ status: 200, description: 'Submissions retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getSubmissionsByProject(@Param('projectId') projectId: string) {
    return this.formsService.getSubmissionsByProject(projectId);
  }

  @Get('submissions/worker/:workerId')
  @ApiOperation({ summary: 'Get all submissions by a worker' })
  @ApiResponse({ status: 200, description: 'Submissions retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getSubmissionsByWorker(@Param('workerId') workerId: string) {
    return this.formsService.getSubmissionsByWorker(workerId);
  }
}
