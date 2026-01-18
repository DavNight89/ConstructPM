import { Model } from 'mongoose';
import { Form, FormDocument } from './schemas/form.schema';
import { Submission, SubmissionDocument } from './schemas/submission.schema';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { FilterFormDto } from './dto/filter-form.dto';
import { FilterSubmissionDto } from './dto/filter-submission.dto';
import { ApproveSubmissionDto } from './dto/approve-submission.dto';
export declare class FormsService {
    private formModel;
    private submissionModel;
    constructor(formModel: Model<FormDocument>, submissionModel: Model<SubmissionDocument>);
    createForm(createFormDto: CreateFormDto): Promise<Form>;
    findAllForms(filterDto: FilterFormDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, FormDocument, {}, {}> & Form & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findFormById(id: string): Promise<Form>;
    updateForm(id: string, updateFormDto: UpdateFormDto): Promise<Form>;
    deleteForm(id: string): Promise<void>;
    duplicateForm(id: string, userId: string): Promise<Form>;
    createSubmission(createSubmissionDto: CreateSubmissionDto): Promise<Submission>;
    private validateSubmissionData;
    findAllSubmissions(filterDto: FilterSubmissionDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, SubmissionDocument, {}, {}> & Submission & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findSubmissionById(id: string): Promise<Submission>;
    approveSubmission(id: string, approveDto: ApproveSubmissionDto): Promise<Submission>;
    deleteSubmission(id: string): Promise<void>;
    getFormStats(formId: string): Promise<{
        formId: string;
        formName: string;
        submissions: {
            total: number;
            submitted: number;
            approved: number;
            rejected: number;
        };
        version: number;
    }>;
    getSubmissionsByProject(projectId: string): Promise<(import("mongoose").Document<unknown, {}, SubmissionDocument, {}, {}> & Submission & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getSubmissionsByWorker(workerId: string): Promise<(import("mongoose").Document<unknown, {}, SubmissionDocument, {}, {}> & Submission & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
