import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { JobStatus } from '../../../database/entities/job.entity';

export class UpdateJobStatusDto {
  @ApiProperty({
    description: 'New status for the job',
    enum: JobStatus,
    example: JobStatus.IN_PROGRESS,
  })
  @IsEnum(JobStatus)
  status: JobStatus;

  @ApiProperty({
    description: 'Optional notes about the status change',
    example: 'Started work on site',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
