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
exports.FormsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const forms_service_1 = require("./forms.service");
const create_form_dto_1 = require("./dto/create-form.dto");
const update_form_dto_1 = require("./dto/update-form.dto");
const create_submission_dto_1 = require("./dto/create-submission.dto");
const filter_form_dto_1 = require("./dto/filter-form.dto");
const filter_submission_dto_1 = require("./dto/filter-submission.dto");
const approve_submission_dto_1 = require("./dto/approve-submission.dto");
let FormsController = class FormsController {
    formsService;
    constructor(formsService) {
        this.formsService = formsService;
    }
    createForm(createFormDto) {
        return this.formsService.createForm(createFormDto);
    }
    findAllForms(filterDto) {
        return this.formsService.findAllForms(filterDto);
    }
    findFormById(id) {
        return this.formsService.findFormById(id);
    }
    updateForm(id, updateFormDto) {
        return this.formsService.updateForm(id, updateFormDto);
    }
    deleteForm(id) {
        return this.formsService.deleteForm(id);
    }
    duplicateForm(id, userId) {
        return this.formsService.duplicateForm(id, userId);
    }
    getFormStats(id) {
        return this.formsService.getFormStats(id);
    }
    createSubmission(createSubmissionDto) {
        return this.formsService.createSubmission(createSubmissionDto);
    }
    findAllSubmissions(filterDto) {
        return this.formsService.findAllSubmissions(filterDto);
    }
    findSubmissionById(id) {
        return this.formsService.findSubmissionById(id);
    }
    approveSubmission(id, approveDto) {
        return this.formsService.approveSubmission(id, approveDto);
    }
    deleteSubmission(id) {
        return this.formsService.deleteSubmission(id);
    }
    getSubmissionsByProject(projectId) {
        return this.formsService.getSubmissionsByProject(projectId);
    }
    getSubmissionsByWorker(workerId) {
        return this.formsService.getSubmissionsByWorker(workerId);
    }
};
exports.FormsController = FormsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new dynamic form' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Form created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_form_dto_1.CreateFormDto]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "createForm", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all forms with filters and pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Forms retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_form_dto_1.FilterFormDto]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "findAllForms", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a form by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Form retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Form not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "findFormById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a form' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Form updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Form not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_form_dto_1.UpdateFormDto]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "updateForm", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a form (only if no submissions)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Form deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Form not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot delete form with submissions' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "deleteForm", null);
__decorate([
    (0, common_1.Post)(':id/duplicate'),
    (0, swagger_1.ApiOperation)({ summary: 'Duplicate a form' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Form duplicated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Form not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "duplicateForm", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get form statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Form not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "getFormStats", null);
__decorate([
    (0, common_1.Post)('submissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a form response' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Submission created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_submission_dto_1.CreateSubmissionDto]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "createSubmission", null);
__decorate([
    (0, common_1.Get)('submissions/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all submissions with filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Submissions retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_submission_dto_1.FilterSubmissionDto]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "findAllSubmissions", null);
__decorate([
    (0, common_1.Get)('submissions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a submission by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Submission retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Submission not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "findSubmissionById", null);
__decorate([
    (0, common_1.Post)('submissions/:id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve or reject a submission' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Submission status updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Submission not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid status transition' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approve_submission_dto_1.ApproveSubmissionDto]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "approveSubmission", null);
__decorate([
    (0, common_1.Delete)('submissions/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a submission' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Submission deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Submission not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "deleteSubmission", null);
__decorate([
    (0, common_1.Get)('submissions/project/:projectId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all submissions for a project' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Submissions retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "getSubmissionsByProject", null);
__decorate([
    (0, common_1.Get)('submissions/worker/:workerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all submissions by a worker' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Submissions retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('workerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "getSubmissionsByWorker", null);
exports.FormsController = FormsController = __decorate([
    (0, swagger_1.ApiTags)('Forms'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('forms'),
    __metadata("design:paramtypes", [forms_service_1.FormsService])
], FormsController);
//# sourceMappingURL=forms.controller.js.map