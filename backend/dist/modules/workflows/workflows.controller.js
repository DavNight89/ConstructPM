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
exports.WorkflowsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const workflows_service_1 = require("./workflows.service");
const workflow_execution_service_1 = require("./services/workflow-execution.service");
const create_workflow_dto_1 = require("./dto/create-workflow.dto");
const update_workflow_dto_1 = require("./dto/update-workflow.dto");
const execute_workflow_dto_1 = require("./dto/execute-workflow.dto");
const workflow_execution_schema_1 = require("./schemas/workflow-execution.schema");
let WorkflowsController = class WorkflowsController {
    workflowsService;
    executionService;
    constructor(workflowsService, executionService) {
        this.workflowsService = workflowsService;
        this.executionService = executionService;
    }
    async create(createWorkflowDto) {
        const userId = '507f1f77bcf86cd799439011';
        const organizationId = '507f1f77bcf86cd799439012';
        return this.workflowsService.create(createWorkflowDto, userId, organizationId);
    }
    async findAll(organizationId, isActive, triggerType) {
        return this.workflowsService.findAll({
            organizationId,
            isActive,
            triggerType,
        });
    }
    async getStatistics(organizationId) {
        return this.workflowsService.getStatistics(organizationId);
    }
    async findOne(id) {
        return this.workflowsService.findOne(id);
    }
    async update(id, updateWorkflowDto) {
        return this.workflowsService.update(id, updateWorkflowDto);
    }
    async remove(id) {
        await this.workflowsService.remove(id);
        return { message: 'Workflow deactivated successfully' };
    }
    async hardDelete(id) {
        await this.workflowsService.hardDelete(id);
        return { message: 'Workflow permanently deleted' };
    }
    async toggleActive(id) {
        return this.workflowsService.toggleActive(id);
    }
    async execute(id, executeDto) {
        return this.executionService.executeWorkflow(id, executeDto.triggerData, executeDto.triggeredBy, executeDto.metadata);
    }
    async getExecutionHistory(id, limit) {
        return this.executionService.getExecutionHistory(id, limit || 50);
    }
    async getExecutionById(executionId) {
        return this.executionService.getExecutionById(executionId);
    }
    async getAllExecutions(status, workflowId, organizationId, startDate, endDate, limit) {
        return this.executionService.getAllExecutions({
            status,
            workflowId,
            organizationId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        }, limit || 100);
    }
};
exports.WorkflowsController = WorkflowsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new workflow' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Workflow created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid workflow configuration' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_workflow_dto_1.CreateWorkflowDto]),
    __metadata("design:returntype", Promise)
], WorkflowsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all workflows' }),
    (0, swagger_1.ApiQuery)({ name: 'organizationId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'triggerType', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of workflows' }),
    __param(0, (0, common_1.Query)('organizationId')),
    __param(1, (0, common_1.Query)('isActive')),
    __param(2, (0, common_1.Query)('triggerType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, String]),
    __metadata("design:returntype", Promise)
], WorkflowsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get workflow statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'organizationId', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workflow statistics' }),
    __param(0, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkflowsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a workflow by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workflow details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Workflow not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkflowsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a workflow' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workflow updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Workflow not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_workflow_dto_1.UpdateWorkflowDto]),
    __metadata("design:returntype", Promise)
], WorkflowsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a workflow (soft delete)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Workflow deactivated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Workflow not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkflowsController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)(':id/hard'),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete a workflow' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Workflow permanently deleted',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Workflow not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkflowsController.prototype, "hardDelete", null);
__decorate([
    (0, common_1.Post)(':id/toggle'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle workflow active status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workflow status toggled' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Workflow not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkflowsController.prototype, "toggleActive", null);
__decorate([
    (0, common_1.Post)(':id/execute'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute a workflow manually' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Workflow execution started' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Workflow not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, execute_workflow_dto_1.ExecuteWorkflowDto]),
    __metadata("design:returntype", Promise)
], WorkflowsController.prototype, "execute", null);
__decorate([
    (0, common_1.Get)(':id/executions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get execution history for a workflow' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Execution history' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], WorkflowsController.prototype, "getExecutionHistory", null);
__decorate([
    (0, common_1.Get)('executions/:executionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get execution details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Execution details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Execution not found' }),
    __param(0, (0, common_1.Param)('executionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkflowsController.prototype, "getExecutionById", null);
__decorate([
    (0, common_1.Get)('executions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all workflow executions with filters' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: workflow_execution_schema_1.ExecutionStatus }),
    (0, swagger_1.ApiQuery)({ name: 'workflowId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'organizationId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of executions' }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('workflowId')),
    __param(2, (0, common_1.Query)('organizationId')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], WorkflowsController.prototype, "getAllExecutions", null);
exports.WorkflowsController = WorkflowsController = __decorate([
    (0, swagger_1.ApiTags)('Workflows'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('workflows'),
    __metadata("design:paramtypes", [workflows_service_1.WorkflowsService,
        workflow_execution_service_1.WorkflowExecutionService])
], WorkflowsController);
//# sourceMappingURL=workflows.controller.js.map