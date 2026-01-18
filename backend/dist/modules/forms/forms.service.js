"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const form_schema_1 = require("./schemas/form.schema");
const submission_schema_1 = require("./schemas/submission.schema");
let FormsService = class FormsService {
    formModel;
    submissionModel;
    constructor(formModel, submissionModel) {
        this.formModel = formModel;
        this.submissionModel = submissionModel;
    }
    async createForm(createFormDto) {
        const fieldIds = createFormDto.fields.map(f => f.id);
        if (new Set(fieldIds).size !== fieldIds.length) {
            throw new common_1.BadRequestException('Field IDs must be unique');
        }
        const validTypes = ['text', 'number', 'select', 'checkbox', 'date', 'textarea', 'file', 'signature', 'radio', 'email', 'phone', 'url'];
        for (const field of createFormDto.fields) {
            if (!validTypes.includes(field.type)) {
                throw new common_1.BadRequestException(`Invalid field type: ${field.type}`);
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
    async findAllForms(filterDto) {
        const { category, search, createdBy, page = 1, limit = 10 } = filterDto;
        const query = {};
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
    async findFormById(id) {
        const form = await this.formModel.findById(id).exec();
        if (!form) {
            throw new common_1.NotFoundException(`Form with ID ${id} not found`);
        }
        return form;
    }
    async updateForm(id, updateFormDto) {
        if (updateFormDto.fields) {
            const fieldIds = updateFormDto.fields.map(f => f.id);
            if (new Set(fieldIds).size !== fieldIds.length) {
                throw new common_1.BadRequestException('Field IDs must be unique');
            }
        }
        const form = await this.formModel.findByIdAndUpdate(id, updateFormDto, { new: true }).exec();
        if (!form) {
            throw new common_1.NotFoundException(`Form with ID ${id} not found`);
        }
        return form;
    }
    async deleteForm(id) {
        const submissionCount = await this.submissionModel.countDocuments({ formId: id }).exec();
        if (submissionCount > 0) {
            throw new common_1.BadRequestException(`Cannot delete form with ${submissionCount} submissions. Archive it instead.`);
        }
        const result = await this.formModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Form with ID ${id} not found`);
        }
    }
    async duplicateForm(id, userId) {
        const originalForm = await this.findFormById(id);
        const formDoc = originalForm;
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
    async createSubmission(createSubmissionDto) {
        const form = await this.findFormById(createSubmissionDto.formId);
        const errors = this.validateSubmissionData(form, createSubmissionDto.data);
        if (errors.length > 0) {
            throw new common_1.BadRequestException({
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
            status: submission_schema_1.SubmissionStatus.SUBMITTED,
        });
        const savedSubmission = await submission.save();
        await this.formModel.findByIdAndUpdate(createSubmissionDto.formId, { $inc: { 'metadata.submissions': 1 } }).exec();
        return savedSubmission;
    }
    validateSubmissionData(form, data) {
        const errors = [];
        for (const field of form.fields) {
            const value = data[field.id];
            if (field.required && (value === undefined || value === null || value === '')) {
                errors.push(`Field "${field.label}" is required`);
                continue;
            }
            if (!field.required && (value === undefined || value === null || value === '')) {
                continue;
            }
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
    async findAllSubmissions(filterDto) {
        const { formId, projectId, workerId, jobId, status, page = 1, limit = 10 } = filterDto;
        const query = {};
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
    async findSubmissionById(id) {
        const submission = await this.submissionModel.findById(id).exec();
        if (!submission) {
            throw new common_1.NotFoundException(`Submission with ID ${id} not found`);
        }
        return submission;
    }
    async approveSubmission(id, approveDto) {
        const submission = await this.findSubmissionById(id);
        if (submission.status !== submission_schema_1.SubmissionStatus.SUBMITTED) {
            throw new common_1.BadRequestException('Only submitted submissions can be approved/rejected');
        }
        const submissionDoc = submission;
        submissionDoc.status = approveDto.status;
        submissionDoc.approvals.push({
            userId: approveDto.userId,
            action: approveDto.status,
            comment: approveDto.comment,
            timestamp: new Date(),
        });
        return submissionDoc.save();
    }
    async deleteSubmission(id) {
        const result = await this.submissionModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Submission with ID ${id} not found`);
        }
        await this.formModel.findByIdAndUpdate(result.formId, { $inc: { 'metadata.submissions': -1 } }).exec();
    }
    async getFormStats(formId) {
        const form = await this.findFormById(formId);
        const [totalSubmissions, submittedCount, approvedCount, rejectedCount] = await Promise.all([
            this.submissionModel.countDocuments({ formId }).exec(),
            this.submissionModel.countDocuments({ formId, status: submission_schema_1.SubmissionStatus.SUBMITTED }).exec(),
            this.submissionModel.countDocuments({ formId, status: submission_schema_1.SubmissionStatus.APPROVED }).exec(),
            this.submissionModel.countDocuments({ formId, status: submission_schema_1.SubmissionStatus.REJECTED }).exec(),
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
    async getSubmissionsByProject(projectId) {
        return this.submissionModel.find({ projectId }).sort({ createdAt: -1 }).exec();
    }
    async getSubmissionsByWorker(workerId) {
        return this.submissionModel.find({ workerId }).sort({ createdAt: -1 }).exec();
    }
};
exports.FormsService = FormsService;
exports.FormsService = FormsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(form_schema_1.Form.name)),
    __param(1, (0, mongoose_1.InjectModel)(submission_schema_1.Submission.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], FormsService);
//# sourceMappingURL=forms.service.js.map