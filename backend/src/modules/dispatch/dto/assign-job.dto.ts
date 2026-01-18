import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString } from 'class-validator';

export class AssignJobDto {
  @ApiProperty({
    description: 'Worker ID to assign the job to',
    example: 'af35a1ad-6260-4ab9-9cb8-9275df4ac70c',
  })
  @IsUUID()
  workerId: string;

  @ApiProperty({
    description: 'Optional notes for the assignment',
    example: 'Worker has the required certifications',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
