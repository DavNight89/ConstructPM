import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { SubmissionStatus } from '../schemas/submission.schema';

export class ApproveSubmissionDto {
  @ApiProperty({ enum: SubmissionStatus, example: SubmissionStatus.APPROVED })
  @IsEnum(SubmissionStatus)
  status: SubmissionStatus;

  @ApiProperty({ example: 'user-id-123' })
  @IsString()
  userId: string;

  @ApiPropertyOptional({ example: 'Looks good, approved!' })
  @IsString()
  @IsOptional()
  comment?: string;
}
