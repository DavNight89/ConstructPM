import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsObject,
  Min,
  Max,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

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

export class CreateProjectDto {
  @ApiProperty({ example: 'Downtown Office Building' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Commercial office building with 10 floors' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '123 Main St, City, State 12345' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 1000000, description: 'Budget in dollars' })
  @IsNumber()
  @IsNotEmpty()
  budget: number;

  @ApiPropertyOptional({ example: 0, description: 'Amount spent so far' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  spent?: number;

  @ApiProperty({ example: '2025-01-15' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2025-12-31' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @ApiPropertyOptional({
    enum: ProjectStatus,
    example: ProjectStatus.PLANNING,
    default: ProjectStatus.PLANNING,
  })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @ApiPropertyOptional({
    enum: ProjectPriority,
    example: ProjectPriority.MEDIUM,
    default: ProjectPriority.MEDIUM,
  })
  @IsEnum(ProjectPriority)
  @IsOptional()
  priority?: ProjectPriority;

  @ApiPropertyOptional({
    example: 0,
    description: 'Completion percentage (0-100)',
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiPropertyOptional({
    example: { lat: 40.7128, lng: -74.006 },
    description: 'GPS coordinates of project location',
  })
  @IsObject()
  @IsOptional()
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };

  @ApiProperty({
    example: 'af35a1ad-6260-4ab9-9cb8-9275df4ac70c',
    description: 'Project manager user ID',
  })
  @IsString()
  @IsNotEmpty()
  managerId: string;
}
