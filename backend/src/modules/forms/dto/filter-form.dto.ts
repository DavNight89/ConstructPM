import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class FilterFormDto {
  @ApiPropertyOptional({ example: 'inspection' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 'inspection', description: 'Search in form name' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 'user-id-123' })
  @IsString()
  @IsOptional()
  createdBy?: string;

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
