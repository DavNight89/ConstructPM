import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsNumber, Min } from 'class-validator';
import { SubmissionStatus } from '../schemas/submission.schema';

export class FilterSubmissionDto {
  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsOptional()
  formId?: string;

  @ApiPropertyOptional({ example: 'project-uuid-123' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional({ example: 'worker-uuid-456' })
  @IsString()
  @IsOptional()
  workerId?: string;

  @ApiPropertyOptional({ example: 'job-uuid-789' })
  @IsString()
  @IsOptional()
  jobId?: string;

  @ApiPropertyOptional({ enum: SubmissionStatus })
  @IsEnum(SubmissionStatus)
  @IsOptional()
  status?: SubmissionStatus;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number = 10;
}
