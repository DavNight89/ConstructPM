import { ReportColumn } from '../schemas/report.schema';
export interface PdfGenerationOptions {
    title: string;
    subtitle?: string;
    columns: ReportColumn[];
    data: any[];
    styling?: {
        orientation?: 'portrait' | 'landscape';
        pageSize?: 'A4' | 'Letter' | 'Legal';
        fontSize?: number;
        headerColor?: string;
        showLogo?: boolean;
        showPageNumbers?: boolean;
    };
}
export declare class PdfGeneratorService {
    private readonly logger;
    generatePdf(options: PdfGenerationOptions): Promise<{
        buffer: Buffer;
        filename: string;
    }>;
    private simulatePdfGeneration;
    private formatTable;
    private formatValue;
    private getNestedValue;
    private sanitizeFilename;
    private calculatePageCount;
}
