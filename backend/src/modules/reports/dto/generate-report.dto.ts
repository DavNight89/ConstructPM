import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsObject,
  IsEnum,
  IsArray,
  IsDateString,
} from 'class-validator';
import { ReportFormat } from '../schemas/report.schema';

export class GenerateReportDto {
  @ApiPropertyOptional({
    enum: ReportFormat,
    isArray: true,
    example: [ReportFormat.PDF],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ReportFormat, { each: true })
  formats?: ReportFormat[];

  @ApiPropertyOptional({
    example: {
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      status: 'completed',
    },
  })
  @IsOptional()
  @IsObject()
  parameters?: Record<string, any>;

  @ApiPropertyOptional({
    example: {
      source: 'manual',
      requestedBy: 'manager',
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
