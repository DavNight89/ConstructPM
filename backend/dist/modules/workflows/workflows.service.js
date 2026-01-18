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
exports.WorkflowsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const workflow_schema_1 = require("./schemas/workflow.schema");
let WorkflowsService = class WorkflowsService {
    workflowModel;
    constructor(workflowModel) {
        this.workflowModel = workflowModel;
    }
    async create(createWorkflowDto, userId, organizationId) {
        this.validateWorkflow(createWorkflowDto);
        const workflow = new this.workflowModel({
            ...createWorkflowDto,
            createdBy: new mongoose_2.Types.ObjectId(userId),
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            isActive: createWorkflowDto.isActive ?? true,
        });
        return workflow.save();
    }
    async findAll(filters) {
        const query = {};
        if (filters?.organizationId) {
            query.organizationId = new mongoose_2.Types.ObjectId(filters.organizationId);
        }
        if (filters?.isActive !== undefined) {
            query.isActive = filters.isActive;
        }
        if (filters?.triggerType) {
            query['trigger.type'] = filters.triggerType;
        }
        return this.workflowModel.find(query).sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const workflow = await this.workflowModel.findById(id);
        if (!workflow) {
            throw new common_1.NotFoundException(`Workflow ${id} not found`);
        }
        return workflow;
    }
    async update(id, updateWorkflowDto) {
        if (Object.keys(updateWorkflowDto).length > 0) {
            this.validateWorkflow(updateWorkflowDto);
        }
        const workflow = await this.workflowModel.findByIdAndUpdate(id, { $set: updateWorkflowDto }, { new: true });
        if (!workflow) {
            throw new common_1.NotFoundException(`Workflow ${id} not found`);
        }
        return workflow;
    }
    async remove(id) {
        const result = await this.workflowModel.findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true });
        if (!result) {
            throw new common_1.NotFoundException(`Workflow ${id} not found`);
        }
    }
    async hardDelete(id) {
        const result = await this.workflowModel.findByIdAndDelete(id);
        if (!result) {
            throw new common_1.NotFoundException(`Workflow ${id} not found`);
        }
    }
    async toggleActive(id) {
        const workflow = await this.findOne(id);
        workflow.isActive = !workflow.isActive;
        return workflow.save();
    }
    async findByTriggerType(triggerType) {
        return this.workflowModel
            .find({
            'trigger.type': triggerType,
            isActive: true,
        })
            .exec();
    }
    async findWorkflowsForForm(formId) {
        return this.workflowModel
            .find({
            'trigger.type': 'form_submit',
            'trigger.config.formId': formId,
            isActive: true,
        })
            .exec();
    }
    validateWorkflow(workflow) {
        if (workflow.trigger) {
            if (!workflow.trigger.type) {
                throw new common_1.BadRequestException('Trigger type is required');
            }
            if (!workflow.trigger.config) {
                throw new common_1.BadRequestException('Trigger config is required');
            }
        }
        if (workflow.actions) {
            if (!Array.isArray(workflow.actions) || workflow.actions.length === 0) {
                throw new common_1.BadRequestException('At least one action is required in a workflow');
            }
            for (const action of workflow.actions) {
                if (!action.type) {
                    throw new common_1.BadRequestException('Action type is required');
                }
                if (!action.config) {
                    throw new common_1.BadRequestException('Action config is required');
                }
            }
        }
    }
    async getStatistics(organizationId) {
        const query = {};
        if (organizationId) {
            query.organizationId = new mongoose_2.Types.ObjectId(organizationId);
        }
        const total = await this.workflowModel.countDocuments(query);
        const active = await this.workflowModel.countDocuments({
            ...query,
            isActive: true,
        });
        const inactive = total - active;
        const byTriggerType = await this.workflowModel.aggregate([
            { $match: query },
            { $group: { _id: '$trigger.type', count: { $sum: 1 } } },
        ]);
        return {
            total,
            active,
            inactive,
            byTriggerType: byTriggerType.map((item) => ({
                type: item._id,
                count: item.count,
            })),
        };
    }
};
exports.WorkflowsService = WorkflowsService;
exports.WorkflowsService = WorkflowsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(workflow_schema_1.Workflow.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], WorkflowsService);
//# sourceMappingURL=workflows.service.js.map