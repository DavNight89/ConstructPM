import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsObject,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  TriggerType,
  ActionType,
  ConditionOperator,
  WorkflowCondition,
  WorkflowAction,
} from '../schemas/workflow.schema';
import type { WorkflowTrigger } from '../schemas/workflow.schema';

class WorkflowConditionDto implements WorkflowCondition {
  @ApiProperty({ example: 'status' })
  @IsString()
  @IsNotEmpty()
  field: string;

  @ApiProperty({ enum: ConditionOperator, example: ConditionOperator.EQUALS })
  @IsEnum(ConditionOperator)
  operator: ConditionOperator;

  @ApiProperty({ example: 'completed' })
  value: any;

  @ApiPropertyOptional({ enum: ['AND', 'OR'], example: 'AND' })
  @IsOptional()
  @IsEnum(['AND', 'OR'])
  logicalOperator?: 'AND' | 'OR';
}

class WorkflowActionDto implements WorkflowAction {
  @ApiProperty({ enum: ActionType, example: ActionType.SEND_EMAIL })
  @IsEnum(ActionType)
  type: ActionType;

  @ApiProperty({
    example: {
      to: '{{user.email}}',
      subject: 'Form Submitted',
      template: 'form-submitted',
    },
  })
  @IsObject()
  config: Record<string, any>;

  @ApiPropertyOptional({ type: [WorkflowConditionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkflowConditionDto)
  conditions?: WorkflowCondition[];
}

class WorkflowTriggerDto implements WorkflowTrigger {
  @ApiProperty({ enum: TriggerType, example: TriggerType.FORM_SUBMIT })
  @IsEnum(TriggerType)
  type: TriggerType;

  @ApiProperty({
    example: {
      formId: '507f1f77bcf86cd799439011',
      conditions: [],
    },
  })
  @IsObject()
  config: Record<string, any>;
}

export class CreateWorkflowDto {
  @ApiProperty({ example: 'Send email on form submission' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Automatically sends email when form is submitted' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: WorkflowTriggerDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => WorkflowTriggerDto)
  trigger: WorkflowTrigger;

  @ApiProperty({ type: [WorkflowActionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkflowActionDto)
  actions: WorkflowAction[];

  @ApiPropertyOptional({ type: [WorkflowConditionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkflowConditionDto)
  conditions?: WorkflowCondition[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: {
      tags: ['email', 'notification'],
      priority: 'high',
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
