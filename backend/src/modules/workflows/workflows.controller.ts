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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { WorkflowsService } from './workflows.service';
import { WorkflowExecutionService } from './services/workflow-execution.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { ExecuteWorkflowDto } from './dto/execute-workflow.dto';
import { ExecutionStatus } from './schemas/workflow-execution.schema';

@ApiTags('Workflows')
@ApiBearerAuth()
@Controller('workflows')
// @UseGuards(JwtAuthGuard) // Uncomment when auth is ready
export class WorkflowsController {
  constructor(
    private readonly workflowsService: WorkflowsService,
    private readonly executionService: WorkflowExecutionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workflow' })
  @ApiResponse({ status: 201, description: 'Workflow created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid workflow configuration' })
  async create(@Body() createWorkflowDto: CreateWorkflowDto) {
    // TODO: Get userId and organizationId from authenticated user
    const userId = '507f1f77bcf86cd799439011';
    const organizationId = '507f1f77bcf86cd799439012';

    return this.workflowsService.create(
      createWorkflowDto,
      userId,
      organizationId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all workflows' })
  @ApiQuery({ name: 'organizationId', required: false })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'triggerType', required: false })
  @ApiResponse({ status: 200, description: 'List of workflows' })
  async findAll(
    @Query('organizationId') organizationId?: string,
    @Query('isActive') isActive?: boolean,
    @Query('triggerType') triggerType?: string,
  ) {
    return this.workflowsService.findAll({
      organizationId,
      isActive,
      triggerType,
    });
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get workflow statistics' })
  @ApiQuery({ name: 'organizationId', required: false })
  @ApiResponse({ status: 200, description: 'Workflow statistics' })
  async getStatistics(@Query('organizationId') organizationId?: string) {
    return this.workflowsService.getStatistics(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a workflow by ID' })
  @ApiResponse({ status: 200, description: 'Workflow details' })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  async findOne(@Param('id') id: string) {
    return this.workflowsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a workflow' })
  @ApiResponse({ status: 200, description: 'Workflow updated successfully' })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  async update(
    @Param('id') id: string,
    @Body() updateWorkflowDto: UpdateWorkflowDto,
  ) {
    return this.workflowsService.update(id, updateWorkflowDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workflow (soft delete)' })
  @ApiResponse({
    status: 200,
    description: 'Workflow deactivated successfully',
  })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  async remove(@Param('id') id: string) {
    await this.workflowsService.remove(id);
    return { message: 'Workflow deactivated successfully' };
  }

  @Delete(':id/hard')
  @ApiOperation({ summary: 'Permanently delete a workflow' })
  @ApiResponse({
    status: 200,
    description: 'Workflow permanently deleted',
  })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  async hardDelete(@Param('id') id: string) {
    await this.workflowsService.hardDelete(id);
    return { message: 'Workflow permanently deleted' };
  }

  @Post(':id/toggle')
  @ApiOperation({ summary: 'Toggle workflow active status' })
  @ApiResponse({ status: 200, description: 'Workflow status toggled' })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  async toggleActive(@Param('id') id: string) {
    return this.workflowsService.toggleActive(id);
  }

  // Workflow Execution Endpoints

  @Post(':id/execute')
  @ApiOperation({ summary: 'Execute a workflow manually' })
  @ApiResponse({ status: 201, description: 'Workflow execution started' })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  async execute(
    @Param('id') id: string,
    @Body() executeDto: ExecuteWorkflowDto,
  ) {
    return this.executionService.executeWorkflow(
      id,
      executeDto.triggerData,
      executeDto.triggeredBy,
      executeDto.metadata,
    );
  }

  @Get(':id/executions')
  @ApiOperation({ summary: 'Get execution history for a workflow' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Execution history' })
  async getExecutionHistory(
    @Param('id') id: string,
    @Query('limit') limit?: number,
  ) {
    return this.executionService.getExecutionHistory(id, limit || 50);
  }

  @Get('executions/:executionId')
  @ApiOperation({ summary: 'Get execution details by ID' })
  @ApiResponse({ status: 200, description: 'Execution details' })
  @ApiResponse({ status: 404, description: 'Execution not found' })
  async getExecutionById(@Param('executionId') executionId: string) {
    return this.executionService.getExecutionById(executionId);
  }

  @Get('executions')
  @ApiOperation({ summary: 'Get all workflow executions with filters' })
  @ApiQuery({ name: 'status', required: false, enum: ExecutionStatus })
  @ApiQuery({ name: 'workflowId', required: false })
  @ApiQuery({ name: 'organizationId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of executions' })
  async getAllExecutions(
    @Query('status') status?: ExecutionStatus,
    @Query('workflowId') workflowId?: string,
    @Query('organizationId') organizationId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: number,
  ) {
    return this.executionService.getAllExecutions(
      {
        status,
        workflowId,
        organizationId,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
      limit || 100,
    );
  }
}
