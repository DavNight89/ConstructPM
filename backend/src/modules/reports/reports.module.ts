import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportExecutionService } from './services/report-execution.service';
import { PdfGeneratorService } from './services/pdf-generator.service';
import { ExcelGeneratorService } from './services/excel-generator.service';
import { Report, ReportSchema } from './schemas/report.schema';
import {
  ReportExecution,
  ReportExecutionSchema,
} from './schemas/report-execution.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Report.name, schema: ReportSchema },
      { name: ReportExecution.name, schema: ReportExecutionSchema },
    ]),
  ],
  controllers: [ReportsController],
  providers: [
    ReportsService,
    ReportExecutionService,
    PdfGeneratorService,
    ExcelGeneratorService,
  ],
  exports: [ReportsService, ReportExecutionService],
})
export class ReportsModule {}
