import { Model } from 'mongoose';
import { ReportDocument, ReportStatus } from './schemas/report.schema';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
export declare class ReportsService {
    private reportModel;
    constructor(reportModel: Model<ReportDocument>);
    create(createReportDto: CreateReportDto, userId: string, organizationId: string): Promise<ReportDocument>;
    findAll(filters?: {
        organizationId?: string;
        type?: string;
        status?: ReportStatus;
    }): Promise<ReportDocument[]>;
    findOne(id: string): Promise<ReportDocument>;
    update(id: string, updateReportDto: UpdateReportDto): Promise<ReportDocument>;
    remove(id: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
    duplicate(id: string, userId: string): Promise<ReportDocument>;
    getStatistics(organizationId?: string): Promise<any>;
    private validateReport;
    findByType(type: string): Promise<ReportDocument[]>;
    findScheduledReports(): Promise<ReportDocument[]>;
}
