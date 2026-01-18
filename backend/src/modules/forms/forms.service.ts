import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Form, FormDocument } from './schemas/form.schema';
import { Submission, SubmissionDocument, SubmissionStatus } from './schemas/submission.schema';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { FilterFormDto } from './dto/filter-form.dto';
import { FilterSubmissionDto } from './dto/filter-submission.dto';
import { ApproveSubmissionDto } from './dto/approve-submission.dto';

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form.name) private formModel: Model<FormDocument>,
    @InjectModel(Submission.name) private submissionModel: Model<SubmissionDocument>,
  ) {}

  // Form Management
  async createForm(createFormDto: CreateFormDto): Promise<Form> {
    // Validate field IDs are unique
    const fieldIds = createFormDto.fields.map(f => f.id);
    if (new Set(fieldIds).size !== fieldIds.length) {
      throw new BadRequestException('Field IDs must be unique');
    }

    // Validate field types
    const validTypes = ['text', 'number', 'select', 'checkbox', 'date', 'textarea', 'file', 'signature', 'radio', 'email', 'phone', 'url'];
    for (const field of createFormDto.fields) {
      if (!validTypes.includes(field.type)) {
        throw new BadRequestException(`Invalid field type: ${field.type}`);
      }
    }

    const form = new this.formModel({
      ...createFormDto,
      metadata: {
        ...createFormDto.metadata,
        submissions: 0,
      },
    });

    return form.save();
  }

  async findAllForms(filterDto: FilterFormDto) {
    const { category, search, createdBy, page = 1, limit = 10 } = filterDto;

    const query: any = {};

    if (category) {
      query.category = category;
    }

    if (createdBy) {
      query['metadata.createdBy'] = createdBy;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const [forms, total] = await Promise.all([
      this.formModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.formModel.countDocuments(query).exec(),
    ]);

    return {
      data: forms,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findFormById(id: string): Promise<Form> {
    const form = await this.formModel.findById(id).exec();

    if (!form) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }

    return form;
  }

  async updateForm(id: string, updateFormDto: UpdateFormDto): Promise<Form> {
    // Validate field IDs are unique if fields are being updated
    if (updateFormDto.fields) {
      const fieldIds = updateFormDto.fields.map(f => f.id);
      if (new Set(fieldIds).size !== fieldIds.length) {
        throw new BadRequestException('Field IDs must be unique');
      }
    }

    const form = await this.formModel.findByIdAndUpdate(
      id,
      updateFormDto,
      { new: true },
    ).exec();

    if (!form) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }

    return form;
  }

  async deleteForm(id: string): Promise<void> {
    // Check if form has submissions
    const submissionCount = await this.submissionModel.countDocuments({ formId: id }).exec();

    if (submissionCount > 0) {
      throw new BadRequestException(
        `Cannot delete form with ${submissionCount} submissions. Archive it instead.`,
      );
    }

    const result = await this.formModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }
  }

  async duplicateForm(id: string, userId: string): Promise<Form> {
    const originalForm = await this.findFormById(id);
    const formDoc = originalForm as any;

    const newForm = new this.formModel({
      ...(formDoc.toObject ? formDoc.toObject() : formDoc),
      _id: undefined,
      name: `${originalForm.name} (Copy)`,
      version: 1,
      metadata: {
        createdBy: userId,
        submissions: 0,
      },
    });

    return newForm.save();
  }

  // Submission Management
  async createSubmission(createSubmissionDto: CreateSubmissionDto): Promise<Submission> {
    // Validate form exists
    const form = await this.findFormById(createSubmissionDto.formId);

    // Validate data against form fields
    const errors = this.validateSubmissionData(form, createSubmissionDto.data);
    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors,
      });
    }

    const submission = new this.submissionModel({
      ...createSubmissionDto,
      metadata: {
        ...createSubmissionDto.metadata,
        submittedAt: new Date(),
      },
      status: SubmissionStatus.SUBMITTED,
    });

    const savedSubmission = await submission.save();

    // Increment form submission count
    await this.formModel.findByIdAndUpdate(
      createSubmissionDto.formId,
      { $inc: { 'metadata.submissions': 1 } },
    ).exec();

    return savedSubmission;
  }

  private validateSubmissionData(form: Form, data: Record<string, any>): string[] {
    const errors: string[] = [];

    for (const field of form.fields) {
      const value = data[field.id];

      // Check required fields
      if (field.required && (value === undefined || value === null || value === '')) {
        errors.push(`Field "${field.label}" is required`);
        continue;
      }

      // Skip validation for optional empty fields
      if (!field.required && (value === undefined || value === null || value === '')) {
        continue;
      }

      // Type-specific validation
      if (field.type === 'number') {
        if (typeof value !== 'number' && isNaN(Number(value))) {
          errors.push(`Field "${field.label}" must be a number`);
        }
      }

      if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push(`Field "${field.label}" must be a valid email`);
        }
      }

      // Custom validation rules
      if (field.validation) {
        if (field.validation.minLength && value.length < field.validation.minLength) {
          errors.push(`Field "${field.label}" must be at least ${field.validation.minLength} characters`);
        }
        if (field.validation.maxLength && value.length > field.validation.maxLength) {
          errors.push(`Field "${field.label}" must be at most ${field.validation.maxLength} characters`);
        }
        if (field.validation.min !== undefined && Number(value) < field.validation.min) {
          errors.push(`Field "${field.label}" must be at least ${field.validation.min}`);
        }
        if (field.validation.max !== undefined && Number(value) > field.validation.max) {
          errors.push(`Field "${field.label}" must be at most ${field.validation.max}`);
        }
        if (field.validation.pattern) {
          const regex = new RegExp(field.validation.pattern);
          if (!regex.test(value)) {
            errors.push(`Field "${field.label}" does not match the required pattern`);
          }
        }
      }
    }

    return errors;
  }

  async findAllSubmissions(filterDto: FilterSubmissionDto) {
    const { formId, projectId, workerId, jobId, status, page = 1, limit = 10 } = filterDto;

    const query: any = {};

    if (formId) {
      query.formId = formId;
    }

    if (projectId) {
      query.projectId = projectId;
    }

    if (workerId) {
      query.workerId = workerId;
    }

    if (jobId) {
      query.jobId = jobId;
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      this.submissionModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.submissionModel.countDocuments(query).exec(),
    ]);

    return {
      data: submissions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findSubmissionById(id: string): Promise<Submission> {
    const submission = await this.submissionModel.findById(id).exec();

    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    return submission;
  }

  async approveSubmission(id: string, approveDto: ApproveSubmissionDto): Promise<Submission> {
    const submission = await this.findSubmissionById(id);

    if (submission.status !== SubmissionStatus.SUBMITTED) {
      throw new BadRequestException('Only submitted submissions can be approved/rejected');
    }

    const submissionDoc = submission as any;
    submissionDoc.status = approveDto.status;
    submissionDoc.approvals.push({
      userId: approveDto.userId,
      action: approveDto.status,
      comment: approveDto.comment,
      timestamp: new Date(),
    });

    return submissionDoc.save();
  }

  async deleteSubmission(id: string): Promise<void> {
    const result = await this.submissionModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    // Decrement form submission count
    await this.formModel.findByIdAndUpdate(
      result.formId,
      { $inc: { 'metadata.submissions': -1 } },
    ).exec();
  }

  // Analytics
  async getFormStats(formId: string) {
    const form = await this.findFormById(formId);

    const [totalSubmissions, submittedCount, approvedCount, rejectedCount] = await Promise.all([
      this.submissionModel.countDocuments({ formId }).exec(),
      this.submissionModel.countDocuments({ formId, status: SubmissionStatus.SUBMITTED }).exec(),
      this.submissionModel.countDocuments({ formId, status: SubmissionStatus.APPROVED }).exec(),
      this.submissionModel.countDocuments({ formId, status: SubmissionStatus.REJECTED }).exec(),
    ]);

    return {
      formId,
      formName: form.name,
      submissions: {
        total: totalSubmissions,
        submitted: submittedCount,
        approved: approvedCount,
        rejected: rejectedCount,
      },
      version: form.version,
    };
  }

  async getSubmissionsByProject(projectId: string) {
    return this.submissionModel.find({ projectId }).sort({ createdAt: -1 }).exec();
  }

  async getSubmissionsByWorker(workerId: string) {
    return this.submissionModel.find({ workerId }).sort({ createdAt: -1 }).exec();
  }
}
