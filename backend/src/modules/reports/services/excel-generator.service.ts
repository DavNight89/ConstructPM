import { Injectable, Logger } from '@nestjs/common';
import { ReportColumn } from '../schemas/report.schema';

export interface ExcelGenerationOptions {
  title: string;
  sheetName?: string;
  columns: ReportColumn[];
  data: any[];
  includeTimestamp?: boolean;
  includeSummary?: boolean;
}

@Injectable()
export class ExcelGeneratorService {
  private readonly logger = new Logger(ExcelGeneratorService.name);

  /**
   * Generate Excel report
   * TODO: Integrate with actual Excel library (exceljs, xlsx)
   */
  async generateExcel(
    options: ExcelGenerationOptions,
  ): Promise<{ buffer: Buffer; filename: string }> {
    this.logger.log(`Generating Excel report: ${options.title}`);

    try {
      // TODO: Replace with actual Excel generation
      // Libraries: exceljs, xlsx, node-xlsx
      const excelContent = this.simulateExcelGeneration(options);

      const filename = `${this.sanitizeFilename(options.title)}_${Date.now()}.xlsx`;

      return {
        buffer: Buffer.from(excelContent),
        filename,
      };
    } catch (error) {
      this.logger.error(`Excel generation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate CSV report (simpler format)
   */
  async generateCsv(
    options: ExcelGenerationOptions,
  ): Promise<{ buffer: Buffer; filename: string }> {
    this.logger.log(`Generating CSV report: ${options.title}`);

    try {
      const csvContent = this.generateCsvContent(options.columns, options.data);
      const filename = `${this.sanitizeFilename(options.title)}_${Date.now()}.csv`;

      return {
        buffer: Buffer.from(csvContent),
        filename,
      };
    } catch (error) {
      this.logger.error(`CSV generation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Simulate Excel generation (placeholder)
   */
  private simulateExcelGeneration(options: ExcelGenerationOptions): string {
    const { title, sheetName, columns, data, includeTimestamp, includeSummary } =
      options;

    let content = `EXCEL WORKBOOK: ${title}\n`;
    content += `Sheet: ${sheetName || 'Report'}\n`;
    if (includeTimestamp) {
      content += `Generated: ${new Date().toISOString()}\n`;
    }
    content += `\n`;

    // Headers
    content += columns.map((col) => col.label).join('\t') + '\n';

    // Data rows
    data.forEach((row) => {
      const values = columns.map((col) => {
        const value = this.getNestedValue(row, col.field);
        return this.formatValue(value, col);
      });
      content += values.join('\t') + '\n';
    });

    // Summary
    if (includeSummary) {
      content += `\n`;
      content += `SUMMARY\n`;
      content += `Total Records: ${data.length}\n`;

      // Numeric aggregations
      columns.forEach((col) => {
        if (col.type === 'number' && col.aggregate) {
          const values = data
            .map((row) => Number(this.getNestedValue(row, col.field)))
            .filter((v) => !isNaN(v));

          const result = this.calculateAggregate(values, col.aggregate);
          content += `${col.label} (${col.aggregate}): ${result}\n`;
        }
      });
    }

    this.logger.log(`[SIMULATED] Excel generated with ${data.length} records`);

    return content;
  }

  /**
   * Generate CSV content
   */
  private generateCsvContent(columns: ReportColumn[], data: any[]): string {
    const headers = columns.map((col) => this.escapeCsvValue(col.label));
    const rows = data.map((row) =>
      columns.map((col) => {
        const value = this.getNestedValue(row, col.field);
        return this.escapeCsvValue(this.formatValue(value, col));
      }),
    );

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }

  /**
   * Escape CSV value
   */
  private escapeCsvValue(value: any): string {
    const str = String(value || '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  /**
   * Format value based on column type
   */
  private formatValue(value: any, column: ReportColumn): string {
    if (value === null || value === undefined) {
      return '';
    }

    switch (column.type) {
      case 'date':
        return new Date(value).toISOString();

      case 'number':
        if (column.format === 'currency') {
          return `$${Number(value).toFixed(2)}`;
        }
        if (column.format === 'percentage') {
          return `${Number(value).toFixed(2)}%`;
        }
        return String(value);

      case 'boolean':
        return value ? 'TRUE' : 'FALSE';

      case 'string':
      default:
        return String(value);
    }
  }

  /**
   * Calculate aggregate
   */
  private calculateAggregate(
    values: number[],
    aggregate: string,
  ): number | string {
    if (values.length === 0) return 0;

    switch (aggregate) {
      case 'sum':
        return values.reduce((a, b) => a + b, 0);

      case 'avg':
        return values.reduce((a, b) => a + b, 0) / values.length;

      case 'min':
        return Math.min(...values);

      case 'max':
        return Math.max(...values);

      case 'count':
        return values.length;

      default:
        return 0;
    }
  }

  /**
   * Get nested value from object
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Sanitize filename
   */
  private sanitizeFilename(filename: string): string {
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .substring(0, 50);
  }

  /**
   * Apply cell formatting (for actual Excel library)
   */
  private applyCellFormatting(workbook: any, column: ReportColumn): any {
    // TODO: Implement actual cell formatting when integrating Excel library
    const formats: any = {
      currency: { numFmt: '$#,##0.00' },
      percentage: { numFmt: '0.00%' },
      date: { numFmt: 'yyyy-mm-dd' },
    };

    return formats[column.format || ''] || {};
  }
}
