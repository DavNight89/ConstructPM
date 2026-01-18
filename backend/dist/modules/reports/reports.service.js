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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const report_schema_1 = require("./schemas/report.schema");
let ReportsService = class ReportsService {
    reportModel;
    constructor(reportModel) {
        this.reportModel = reportModel;
    }
    async create(createReportDto, userId, organizationId) {
        this.validateReport(createReportDto);
        const report = new this.reportModel({
            ...createReportDto,
            createdBy: new mongoose_2.Types.ObjectId(userId),
            organizationId: new mongoose_2.Types.ObjectId(organizationId),
            status: createReportDto.status || report_schema_1.ReportStatus.DRAFT,
        });
        return report.save();
    }
    async findAll(filters) {
        const query = {};
        if (filters?.organizationId) {
            query.organizationId = new mongoose_2.Types.ObjectId(filters.organizationId);
        }
        if (filters?.type) {
            query.type = filters.type;
        }
        if (filters?.status) {
            query.status = filters.status;
        }
        return this.reportModel.find(query).sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const report = await this.reportModel.findById(id);
        if (!report) {
            throw new common_1.NotFoundException(`Report ${id} not found`);
        }
        return report;
    }
    async update(id, updateReportDto) {
        if (Object.keys(updateReportDto).length > 0) {
            this.validateReport(updateReportDto);
        }
        const report = await this.reportModel.findByIdAndUpdate(id, { $set: updateReportDto }, { new: true });
        if (!report) {
            throw new common_1.NotFoundException(`Report ${id} not found`);
        }
        return report;
    }
    async remove(id) {
        const result = await this.reportModel.findByIdAndUpdate(id, { $set: { status: report_schema_1.ReportStatus.ARCHIVED } }, { new: true });
        if (!result) {
            throw new common_1.NotFoundException(`Report ${id} not found`);
        }
    }
    async hardDelete(id) {
        const result = await this.reportModel.findByIdAndDelete(id);
        if (!result) {
            throw new common_1.NotFoundException(`Report ${id} not found`);
        }
    }
    async duplicate(id, userId) {
        const original = await this.findOne(id);
        const duplicate = new this.reportModel({
            ...original.toObject(),
            _id: undefined,
            name: `${original.name} (Copy)`,
            status: report_schema_1.ReportStatus.DRAFT,
            createdBy: new mongoose_2.Types.ObjectId(userId),
            createdAt: undefined,
            updatedAt: undefined,
        });
        return duplicate.save();
    }
    async getStatistics(organizationId) {
        const query = {};
        if (organizationId) {
            query.organizationId = new mongoose_2.Types.ObjectId(organizationId);
        }
        const total = await this.reportModel.countDocuments(query);
        const active = await this.reportModel.countDocuments({
            ...query,
            status: report_schema_1.ReportStatus.ACTIVE,
        });
        const draft = await this.reportModel.countDocuments({
            ...query,
            status: report_schema_1.ReportStatus.DRAFT,
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
    validateReport(report) {
        if (report.dataSource) {
            if (!report.dataSource.collection) {
                throw new common_1.BadRequestException('Data source collection is required');
            }
        }
        if (report.columns) {
            if (!Array.isArray(report.columns) || report.columns.length === 0) {
                throw new common_1.BadRequestException('At least one column is required in a report');
            }
            for (const column of report.columns) {
                if (!column.field) {
                    throw new common_1.BadRequestException('Column field is required');
                }
                if (!column.label) {
                    throw new common_1.BadRequestException('Column label is required');
                }
                if (!column.type) {
                    throw new common_1.BadRequestException('Column type is required');
                }
            }
        }
        if (report.formats) {
            if (!Array.isArray(report.formats) || report.formats.length === 0) {
                throw new common_1.BadRequestException('At least one output format is required');
            }
        }
    }
    async findByType(type) {
        return this.reportModel
            .find({
            type,
            status: report_schema_1.ReportStatus.ACTIVE,
        })
            .exec();
    }
    async findScheduledReports() {
        return this.reportModel
            .find({
            status: report_schema_1.ReportStatus.ACTIVE,
            scheduleConfig: { $exists: true },
        })
            .exec();
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(report_schema_1.Report.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ReportsService);
//# sourceMappingURL=reports.service.js.map