import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsNumber, Min } from 'class-validator';

enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export class FilterProjectDto {
  @ApiPropertyOptional({ enum: ProjectStatus })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @ApiPropertyOptional({ enum: ProjectPriority })
  @IsEnum(ProjectPriority)
  @IsOptional()
  priority?: ProjectPriority;

  @ApiPropertyOptional({ example: 'af35a1ad-6260-4ab9-9cb8-9275df4ac70c' })
  @IsString()
  @IsOptional()
  managerId?: string;

  @ApiPropertyOptional({ example: 'building', description: 'Search in name and description' })
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
