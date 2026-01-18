import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsArray, IsObject, IsBoolean, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class FormFieldDto {
  @ApiProperty({ example: 'field_1' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'text', description: 'Field type: text, number, select, checkbox, date, textarea, file, signature' })
  @IsString()
  type: string;

  @ApiProperty({ example: 'Project Name' })
  @IsString()
  label: string;

  @ApiPropertyOptional({ example: 'Enter project name' })
  @IsString()
  @IsOptional()
  placeholder?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  required: boolean;

  @ApiPropertyOptional({ example: { minLength: 3, maxLength: 100 } })
  @IsObject()
  @IsOptional()
  validation?: Record<string, any>;

  @ApiPropertyOptional({ example: ['Option 1', 'Option 2'], description: 'For select/radio fields' })
  @IsArray()
  @IsOptional()
  options?: string[];

  @ApiPropertyOptional({ example: 'Default value' })
  @IsOptional()
  defaultValue?: any;

  @ApiProperty({ example: { gridWidth: 12, showIf: null } })
  @IsObject()
  properties: Record<string, any>;
}

class FormSettingsDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  requireGPS: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  requireSignature: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  allowOffline: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  emailNotifications: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  autoSubmit?: boolean;
}

export class CreateFormDto {
  @ApiProperty({ example: 'Daily Inspection Form' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'inspection', description: 'Form category: inspection, safety, timesheet, incident, etc.' })
  @IsString()
  category: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsNumber()
  @IsOptional()
  version?: number;

  @ApiProperty({ type: [FormFieldDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldDto)
  fields: FormFieldDto[];

  @ApiProperty({ type: FormSettingsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => FormSettingsDto)
  settings: FormSettingsDto;

  @ApiPropertyOptional({
    example: [{
      condition: { field: 'field_1', operator: 'equals', value: 'yes' },
      actions: [{ type: 'show', target: 'field_2' }]
    }]
  })
  @IsArray()
  @IsOptional()
  logic?: Array<{
    condition: Record<string, any>;
    actions: Record<string, any>[];
  }>;

  @ApiProperty({ example: { createdBy: 'user-id-123' } })
  @IsObject()
  metadata: {
    createdBy: string;
    submissions?: number;
  };
}
