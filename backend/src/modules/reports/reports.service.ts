import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Report, ReportDocument, ReportStatus } from './schemas/report.schema';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name)
    private reportModel: Model<ReportDocument>,
  ) {}

  /**
   * Create a new report
   */
  async create(
    createReportDto: CreateReportDto,
    userId: string,
    organizationId: string,
  ): Promise<ReportDocument> {
    // Validate report configuration
    this.validateReport(createReportDto);

    const report = new this.reportModel({
      ...createReportDto,
      createdBy: new Types.ObjectId(userId),
      organizationId: new Types.ObjectId(organizationId),
      status: createReportDto.status || ReportStatus.DRAFT,
    });

    return report.save();
  }

  /**
   * Find all reports
   */
  async findAll(filters?: {
    organizationId?: string;
    type?: string;
    status?: ReportStatus;
  }): Promise<ReportDocument[]> {
    const query: any = {};

    if (filters?.organizationId) {
      query.organizationId = new Types.ObjectId(filters.organizationId);
    }
    if (filters?.type) {
      query.type = filters.type;
    }
    if (filters?.status) {
      query.status = filters.status;
    }

    return this.reportModel.find(query).sort({ createdAt: -1 }).exec();
  }

  /**
   * Find one report by ID
   */
  async findOne(id: string): Promise<ReportDocument> {
    const report = await this.reportModel.findById(id);
    if (!report) {
      throw new NotFoundException(`Report ${id} not found`);
    }
    return report;
  }

  /**
   * Update report
   */
  async update(
    id: string,
    updateReportDto: UpdateReportDto,
  ): Promise<ReportDocument> {
    // Validate if provided
    if (Object.keys(updateReportDto).length > 0) {
      this.validateReport(updateReportDto as any);
    }

    const report = await this.reportModel.findByIdAndUpdate(
      id,
      { $set: updateReportDto },
      { new: true },
    );

    if (!report) {
      throw new NotFoundException(`Report ${id} not found`);
    }

    return report;
  }

  /**
   * Delete report (soft delete by setting status to archived)
   */
  async remove(id: string): Promise<void> {
    const result = await this.reportModel.findByIdAndUpdate(
      id,
      { $set: { status: ReportStatus.ARCHIVED } },
      { new: true },
    );

    if (!result) {
      throw new NotFoundException(`Report ${id} not found`);
    }
  }

  /**
   * Hard delete report
   */
  async hardDelete(id: string): Promise<void> {
    const result = await this.reportModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Report ${id} not found`);
    }
  }

  /**
   * Duplicate report
   */
  async duplicate(id: string, userId: string): Promise<ReportDocument> {
    const original = await this.findOne(id);

    const duplicate = new this.reportModel({
      ...original.toObject(),
      _id: undefined,
      name: `${original.name} (Copy)`,
      status: ReportStatus.DRAFT,
      createdBy: new Types.ObjectId(userId),
      createdAt: undefined,
      updatedAt: undefined,
    });

    return duplicate.save();
  }

  /**
   * Get report statistics
   */
  async getStatistics(organizationId?: string): Promise<any> {
    const query: any = {};
    if (organizationId) {
      query.organizationId = new Types.ObjectId(organizationId);
    }

    const total = await this.reportModel.countDocuments(query);
    const active = await this.reportModel.countDocuments({
      ...query,
      status: ReportStatus.ACTIVE,
    });
    const draft = await this.reportModel.countDocuments({
      ...query,
      status: ReportStatus.DRAFT,
    });

    const byType = await this.reportModel.aggregate([
      { $match: query },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    const scheduled = await this.reportModel.countDocuments({
      ...query,
      scheduleConfig: { $exists: true },
    });

    return {
      total,
      active,
      draft,
      archived: total - active - draft,
      scheduled,
      byType: byType.map((item) => ({
        type: item._id,
        count: item.count,
      })),
    };
  }

  /**
   * Validate report configuration
   */
  private validateReport(report: Partial<CreateReportDto>): void {
    // Validate data source
    if (report.dataSource) {
      if (!report.dataSource.collection) {
        throw new BadRequestException('Data source collection is required');
      }
    }

    // Validate columns
    if (report.columns) {
      if (!Array.isArray(report.columns) || report.columns.length === 0) {
        throw new BadRequestException(
          'At least one column is required in a report',
        );
      }

      for (const column of report.columns) {
        if (!column.field) {
          throw new BadRequestException('Column field is required');
        }
        if (!column.label) {
          throw new BadRequestException('Column label is required');
        }
        if (!column.type) {
          throw new BadRequestException('Column type is required');
        }
      }
    }

    // Validate formats
    if (report.formats) {
      if (!Array.isArray(report.formats) || report.formats.length === 0) {
        throw new BadRequestException(
          'At least one output format is required',
        );
      }
    }
  }

  /**
   * Find reports by type
   */
  async findByType(type: string): Promise<ReportDocument[]> {
    return this.reportModel
      .find({
        type,
        status: ReportStatus.ACTIVE,
      })
      .exec();
  }

  /**
   * Find scheduled reports
   */
  async findScheduledReports(): Promise<ReportDocument[]> {
    return this.reportModel
      .find({
        status: ReportStatus.ACTIVE,
        scheduleConfig: { $exists: true },
      })
      .exec();
  }
}
