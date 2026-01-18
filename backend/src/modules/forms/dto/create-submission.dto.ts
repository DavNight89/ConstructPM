import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsObject, IsOptional, IsNumber } from 'class-validator';

export class CreateSubmissionDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  formId: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  formVersion: number;

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

  @ApiProperty({ example: { field_1: 'Answer 1', field_2: 42, field_3: true } })
  @IsObject()
  data: Record<string, any>;

  @ApiPropertyOptional({
    example: {
      gpsLocation: { lat: 40.7128, lng: -74.0060 },
      signature: 'base64-encoded-signature',
      photos: ['photo-url-1', 'photo-url-2']
    }
  })
  @IsObject()
  @IsOptional()
  metadata?: {
    gpsLocation?: { lat: number; lng: number };
    signature?: string;
    photos?: string[];
    ipAddress?: string;
    deviceInfo?: Record<string, any>;
  };
}
