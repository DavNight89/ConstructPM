import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class ExecuteWorkflowDto {
  @ApiProperty({
    example: {
      formId: '507f1f77bcf86cd799439011',
      submissionId: '507f1f77bcf86cd799439012',
      data: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    },
  })
  @IsNotEmpty()
  @IsObject()
  triggerData: Record<string, any>;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439013' })
  @IsOptional()
  @IsString()
  triggeredBy?: string;

  @ApiPropertyOptional({
    example: {
      source: 'manual',
      ip: '192.168.1.1',
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
