import { ReportColumn } from '../schemas/report.schema';
export interface ExcelGenerationOptions {
    title: string;
    sheetName?: string;
    columns: ReportColumn[];
    data: any[];
    includeTimestamp?: boolean;
    includeSummary?: boolean;
}
export declare class ExcelGeneratorService {
    private readonly logger;
    generateExcel(options: ExcelGenerationOptions): Promise<{
        buffer: Buffer;
        filename: string;
    }>;
    generateCsv(options: ExcelGenerationOptions): Promise<{
        buffer: Buffer;
        filename: string;
    }>;
    private simulateExcelGeneration;
    private generateCsvContent;
    private escapeCsvValue;
    private formatValue;
    private calculateAggregate;
    private getNestedValue;
    private sanitizeFilename;
    private applyCellFormatting;
}
