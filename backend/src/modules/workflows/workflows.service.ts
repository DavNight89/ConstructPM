import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Workflow, WorkflowDocument } from './schemas/workflow.schema';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectModel(Workflow.name)
    private workflowModel: Model<WorkflowDocument>,
  ) {}

  /**
   * Create a new workflow
   */
  async create(
    createWorkflowDto: CreateWorkflowDto,
    userId: string,
    organizationId: string,
  ): Promise<WorkflowDocument> {
    // Validate workflow configuration
    this.validateWorkflow(createWorkflowDto);

    const workflow = new this.workflowModel({
      ...createWorkflowDto,
      createdBy: new Types.ObjectId(userId),
      organizationId: new Types.ObjectId(organizationId),
      isActive: createWorkflowDto.isActive ?? true,
    });

    return workflow.save();
  }

  /**
   * Find all workflows
   */
  async findAll(filters?: {
    organizationId?: string;
    isActive?: boolean;
    triggerType?: string;
  }): Promise<WorkflowDocument[]> {
    const query: any = {};

    if (filters?.organizationId) {
      query.organizationId = new Types.ObjectId(filters.organizationId);
    }
    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    if (filters?.triggerType) {
      query['trigger.type'] = filters.triggerType;
    }

    return this.workflowModel.find(query).sort({ createdAt: -1 }).exec();
  }

  /**
   * Find one workflow by ID
   */
  async findOne(id: string): Promise<WorkflowDocument> {
    const workflow = await this.workflowModel.findById(id);
    if (!workflow) {
      throw new NotFoundException(`Workflow ${id} not found`);
    }
    return workflow;
  }

  /**
   * Update workflow
   */
  async update(
    id: string,
    updateWorkflowDto: UpdateWorkflowDto,
  ): Promise<WorkflowDocument> {
    // Validate if provided
    if (Object.keys(updateWorkflowDto).length > 0) {
      this.validateWorkflow(updateWorkflowDto as any);
    }

    const workflow = await this.workflowModel.findByIdAndUpdate(
      id,
      { $set: updateWorkflowDto },
      { new: true },
    );

    if (!workflow) {
      throw new NotFoundException(`Workflow ${id} not found`);
    }

    return workflow;
  }

  /**
   * Delete workflow (soft delete by setting isActive to false)
   */
  async remove(id: string): Promise<void> {
    const result = await this.workflowModel.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true },
    );

    if (!result) {
      throw new NotFoundException(`Workflow ${id} not found`);
    }
  }

  /**
   * Hard delete workflow
   */
  async hardDelete(id: string): Promise<void> {
    const result = await this.workflowModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Workflow ${id} not found`);
    }
  }

  /**
   * Toggle workflow active status
   */
  async toggleActive(id: string): Promise<WorkflowDocument> {
    const workflow = await this.findOne(id);
    workflow.isActive = !workflow.isActive;
    return workflow.save();
  }

  /**
   * Find workflows by trigger type
   */
  async findByTriggerType(triggerType: string): Promise<WorkflowDocument[]> {
    return this.workflowModel
      .find({
        'trigger.type': triggerType,
        isActive: true,
      })
      .exec();
  }

  /**
   * Find workflows that should trigger for a specific form
   */
  async findWorkflowsForForm(formId: string): Promise<WorkflowDocument[]> {
    return this.workflowModel
      .find({
        'trigger.type': 'form_submit',
        'trigger.config.formId': formId,
        isActive: true,
      })
      .exec();
  }

  /**
   * Validate workflow configuration
   */
  private validateWorkflow(workflow: Partial<CreateWorkflowDto>): void {
    // Validate trigger
    if (workflow.trigger) {
      if (!workflow.trigger.type) {
        throw new BadRequestException('Trigger type is required');
      }
      if (!workflow.trigger.config) {
        throw new BadRequestException('Trigger config is required');
      }
    }

    // Validate actions
    if (workflow.actions) {
      if (!Array.isArray(workflow.actions) || workflow.actions.length === 0) {
        throw new BadRequestException(
          'At least one action is required in a workflow',
        );
      }

      for (const action of workflow.actions) {
        if (!action.type) {
          throw new BadRequestException('Action type is required');
        }
        if (!action.config) {
          throw new BadRequestException('Action config is required');
        }
      }
    }
  }

  /**
   * Get workflow statistics
   */
  async getStatistics(organizationId?: string): Promise<any> {
    const query: any = {};
    if (organizationId) {
      query.organizationId = new Types.ObjectId(organizationId);
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
}
