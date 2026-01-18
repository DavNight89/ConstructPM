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
  Res,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { ReportsService } from './reports.service';
import { ReportExecutionService } from './services/report-execution.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { GenerateReportDto } from './dto/generate-report.dto';
import { ReportStatus } from './schemas/report.schema';
import { ExecutionStatus } from './schemas/report-execution.schema';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
// @UseGuards(JwtAuthGuard) // Uncomment when auth is ready
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly executionService: ReportExecutionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new report' })
  @ApiResponse({ status: 201, description: 'Report created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid report configuration' })
  async create(@Body() createReportDto: CreateReportDto) {
    // TODO: Get userId and organizationId from authenticated user
    const userId = '507f1f77bcf86cd799439011';
    const organizationId = '507f1f77bcf86cd799439012';

    return this.reportsService.create(
      createReportDto,
      userId,
      organizationId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all reports' })
  @ApiQuery({ name: 'organizationId', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ReportStatus })
  @ApiResponse({ status: 200, description: 'List of reports' })
  async findAll(
    @Query('organizationId') organizationId?: string,
    @Query('type') type?: string,
    @Query('status') status?: ReportStatus,
  ) {
    return this.reportsService.findAll({
      organizationId,
      type,
      status,
    });
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get report statistics' })
  @ApiQuery({ name: 'organizationId', required: false })
  @ApiResponse({ status: 200, description: 'Report statistics' })
  async getStatistics(@Query('organizationId') organizationId?: string) {
    return this.reportsService.getStatistics(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a report by ID' })
  @ApiResponse({ status: 200, description: 'Report details' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a report' })
  @ApiResponse({ status: 200, description: 'Report updated successfully' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async update(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    return this.reportsService.update(id, updateReportDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a report (soft delete)' })
  @ApiResponse({
    status: 200,
    description: 'Report archived successfully',
  })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async remove(@Param('id') id: string) {
    await this.reportsService.remove(id);
    return { message: 'Report archived successfully' };
  }

  @Delete(':id/hard')
  @ApiOperation({ summary: 'Permanently delete a report' })
  @ApiResponse({
    status: 200,
    description: 'Report permanently deleted',
  })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async hardDelete(@Param('id') id: string) {
    await this.reportsService.hardDelete(id);
    return { message: 'Report permanently deleted' };
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate a report' })
  @ApiResponse({ status: 201, description: 'Report duplicated successfully' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async duplicate(@Param('id') id: string) {
    // TODO: Get userId from authenticated user
    const userId = '507f1f77bcf86cd799439011';
    return this.reportsService.duplicate(id, userId);
  }

  // Report Generation Endpoints

  @Post(':id/generate')
  @ApiOperation({ summary: 'Generate a report' })
  @ApiResponse({ status: 201, description: 'Report generation started' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async generate(
    @Param('id') id: string,
    @Body() generateDto: GenerateReportDto,
  ) {
    // TODO: Get userId from authenticated user
    const userId = '507f1f77bcf86cd799439011';

    return this.executionService.executeReport(
      id,
      generateDto.formats,
      generateDto.parameters,
      userId,
    );
  }

  @Get(':id/executions')
  @ApiOperation({ summary: 'Get execution history for a report' })
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
  @ApiOperation({ summary: 'Get all report executions with filters' })
  @ApiQuery({ name: 'status', required: false, enum: ExecutionStatus })
  @ApiQuery({ name: 'reportId', required: false })
  @ApiQuery({ name: 'organizationId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of executions' })
  async getAllExecutions(
    @Query('status') status?: ExecutionStatus,
    @Query('reportId') reportId?: string,
    @Query('organizationId') organizationId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: number,
  ) {
    return this.executionService.getAllExecutions(
      {
        status,
        reportId,
        organizationId,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
      limit || 100,
    );
  }

  @Get('download/:filename')
  @ApiOperation({ summary: 'Download generated report file' })
  @ApiResponse({ status: 200, description: 'File downloaded' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async downloadFile(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = await this.executionService.getReportFile(filename);

    // Set appropriate content type based on file extension
    const ext = filename.split('.').pop()?.toLowerCase();
    const contentTypes: Record<string, string> = {
      pdf: 'application/pdf',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      csv: 'text/csv',
      json: 'application/json',
    };

    res.set({
      'Content-Type': contentTypes[ext || 'pdf'] || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    return new StreamableFile(file);
  }
}
