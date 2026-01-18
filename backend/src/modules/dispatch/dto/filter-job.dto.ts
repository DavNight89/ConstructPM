import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsUUID, IsString, IsNumber, Min } from 'class-validator';
import { JobStatus, JobPriority } from '../../../database/entities/job.entity';

export class FilterJobDto {
  @ApiPropertyOptional({ enum: JobStatus })
  @IsEnum(JobStatus)
  @IsOptional()
  status?: JobStatus;

  @ApiPropertyOptional({ enum: JobPriority })
  @IsEnum(JobPriority)
  @IsOptional()
  priority?: JobPriority;

  @ApiPropertyOptional({ example: 'af35a1ad-6260-4ab9-9cb8-9275df4ac70c' })
  @IsUUID()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional({ example: 'af35a1ad-6260-4ab9-9cb8-9275df4ac70c' })
  @IsUUID()
  @IsOptional()
  workerId?: string;

  @ApiPropertyOptional({ example: 'repair', description: 'Search in title and description' })
  @IsString()
  @IsOptional()
  search?: string;

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
