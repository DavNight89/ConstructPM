import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { FilterFormDto } from './dto/filter-form.dto';
import { FilterSubmissionDto } from './dto/filter-submission.dto';
import { ApproveSubmissionDto } from './dto/approve-submission.dto';
export declare class FormsController {
    private readonly formsService;
    constructor(formsService: FormsService);
    createForm(createFormDto: CreateFormDto): Promise<import("./schemas/form.schema").Form>;
    findAllForms(filterDto: FilterFormDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/form.schema").FormDocument, {}, {}> & import("./schemas/form.schema").Form & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findFormById(id: string): Promise<import("./schemas/form.schema").Form>;
    updateForm(id: string, updateFormDto: UpdateFormDto): Promise<import("./schemas/form.schema").Form>;
    deleteForm(id: string): Promise<void>;
    duplicateForm(id: string, userId: string): Promise<import("./schemas/form.schema").Form>;
    getFormStats(id: string): Promise<{
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
    createSubmission(createSubmissionDto: CreateSubmissionDto): Promise<import("./schemas/submission.schema").Submission>;
    findAllSubmissions(filterDto: FilterSubmissionDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/submission.schema").SubmissionDocument, {}, {}> & import("./schemas/submission.schema").Submission & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findSubmissionById(id: string): Promise<import("./schemas/submission.schema").Submission>;
    approveSubmission(id: string, approveDto: ApproveSubmissionDto): Promise<import("./schemas/submission.schema").Submission>;
    deleteSubmission(id: string): Promise<void>;
    getSubmissionsByProject(projectId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/submission.schema").SubmissionDocument, {}, {}> & import("./schemas/submission.schema").Submission & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getSubmissionsByWorker(workerId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/submission.schema").SubmissionDocument, {}, {}> & import("./schemas/submission.schema").Submission & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
