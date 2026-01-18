import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubmissionDocument = Submission & Document;

export enum SubmissionStatus {
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema({ collection: 'form_submissions', timestamps: true })
export class Submission {
  @Prop({ required: true })
  formId: string;

  @Prop({ required: true })
  formVersion: number;

  @Prop()
  projectId: string;

  @Prop()
  workerId: string;

  @Prop()
  jobId: string;

  @Prop({ type: Object, required: true })
  data: Record<string, any>;

  @Prop({ type: Object })
  metadata: {
    submittedAt: Date;
    gpsLocation?: {
      lat: number;
      lng: number;
    };
    signature?: string;
    photos?: string[];
    ipAddress?: string;
    deviceInfo?: Record<string, any>;
  };

  @Prop({ type: String, enum: SubmissionStatus, default: SubmissionStatus.SUBMITTED })
  status: SubmissionStatus;

  @Prop({ type: Array, default: [] })
  approvals: Array<{
    userId: string;
    action: string;
    comment?: string;
    timestamp: Date;
  }>;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
