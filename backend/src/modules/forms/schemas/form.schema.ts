import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FormDocument = Form & Document;

@Schema({ collection: 'forms', timestamps: true })
export class Form {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ default: 1 })
  version: number;

  @Prop({ type: Array, required: true })
  fields: Array<{
    id: string;
    type: string;
    label: string;
    placeholder?: string;
    required: boolean;
    validation?: Record<string, any>;
    options?: string[];
    defaultValue?: any;
    properties: Record<string, any>;
  }>;

  @Prop({ type: Object })
  settings: {
    requireGPS: boolean;
    requireSignature: boolean;
    allowOffline: boolean;
    emailNotifications: boolean;
    autoSubmit?: boolean;
  };

  @Prop({ type: Array, default: [] })
  logic: Array<{
    condition: Record<string, any>;
    actions: Record<string, any>[];
  }>;

  @Prop({ type: Object })
  metadata: {
    createdBy: string;
    submissions: number;
  };
}

export const FormSchema = SchemaFactory.createForClass(Form);
