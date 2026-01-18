import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ReportType,
  ReportFormat,
  ReportStatus,
  ReportFilter,
  ReportColumn,
} from '../schemas/report.schema';
import type { ReportScheduleConfig } from '../schemas/report.schema';

class ReportFilterDto implements ReportFilter {
  @ApiProperty({ example: 'status' })
  @IsString()
  field: string;

  @ApiProperty({ example: 'equals' })
  @IsString()
  operator: string;

  @ApiProperty({ example: 'completed' })
  value: any;
}

class ReportColumnDto implements ReportColumn {
  @ApiProperty({ example: 'projectName' })
  @IsString()
  field: string;

  @ApiProperty({ example: 'Project Name' })
  @IsString()
  label: string;

  @ApiProperty({ enum: ['string', 'number', 'date', 'boolean'] })
  @IsEnum(['string', 'number', 'date', 'boolean'])
  type: 'string' | 'number' | 'date' | 'boolean';

  @ApiPropertyOptional({ example: 'currency' })
  @IsOptional()
  @IsString()
  format?: string;

  @ApiPropertyOptional({ enum: ['sum', 'avg', 'min', 'max', 'count'] })
  @IsOptional()
  @IsEnum(['sum', 'avg', 'min', 'max', 'count'])
  aggregate?: 'sum' | 'avg' | 'min' | 'max' | 'count';
}

export class CreateReportDto {
  @ApiProperty({ example: 'Monthly Project Summary' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Summary of all projects for the month' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ReportType, example: ReportType.PROJECT_SUMMARY })
  @IsEnum(ReportType)
  type: ReportType;

  @ApiPropertyOptional({ enum: ReportStatus, example: ReportStatus.ACTIVE })
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @ApiPropertyOptional({
    enum: ReportFormat,
    isArray: true,
    example: [ReportFormat.PDF, ReportFormat.EXCEL],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ReportFormat, { each: true })
  formats?: ReportFormat[];

  @ApiProperty({
    example: {
      collection: 'projects',
      pipeline: [],
    },
  })
  @IsObject()
  dataSource: {
    collection: string;
    pipeline?: any[];
  };

  @ApiPropertyOptional({ type: [ReportFilterDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReportFilterDto)
  filters?: ReportFilter[];

  @ApiProperty({ type: [ReportColumnDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReportColumnDto)
  columns: ReportColumn[];

  @ApiPropertyOptional({
    example: { field: 'createdAt', order: 'desc' },
  })
  @IsOptional()
  @IsObject()
  sorting?: {
    field: string;
    order: 'asc' | 'desc';
  };

  @ApiPropertyOptional({
    example: { field: 'category', aggregations: ['count', 'sum'] },
  })
  @IsOptional()
  @IsObject()
  grouping?: {
    field: string;
    aggregations?: string[];
  };

  @ApiPropertyOptional({
    example: {
      frequency: 'monthly',
      dayOfMonth: 1,
      time: '09:00',
      recipients: ['manager@company.com'],
      formats: ['pdf', 'excel'],
    },
  })
  @IsOptional()
  @IsObject()
  scheduleConfig?: ReportScheduleConfig;

  @ApiPropertyOptional({
    example: {
      orientation: 'landscape',
      pageSize: 'A4',
      fontSize: 10,
      headerColor: '#2563eb',
      showLogo: true,
      showPageNumbers: true,
    },
  })
  @IsOptional()
  @IsObject()
  styling?: {
    orientation?: 'portrait' | 'landscape';
    pageSize?: 'A4' | 'Letter' | 'Legal';
    fontSize?: number;
    headerColor?: string;
    showLogo?: boolean;
    showPageNumbers?: boolean;
  };

  @ApiPropertyOptional({
    example: { tags: ['monthly', 'management'] },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
