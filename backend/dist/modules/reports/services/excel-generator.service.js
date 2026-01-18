"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ExcelGeneratorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelGeneratorService = void 0;
const common_1 = require("@nestjs/common");
let ExcelGeneratorService = ExcelGeneratorService_1 = class ExcelGeneratorService {
    logger = new common_1.Logger(ExcelGeneratorService_1.name);
    async generateExcel(options) {
        this.logger.log(`Generating Excel report: ${options.title}`);
        try {
            const excelContent = this.simulateExcelGeneration(options);
            const filename = `${this.sanitizeFilename(options.title)}_${Date.now()}.xlsx`;
            return {
                buffer: Buffer.from(excelContent),
                filename,
            };
        }
        catch (error) {
            this.logger.error(`Excel generation failed: ${error.message}`);
            throw error;
        }
    }
    async generateCsv(options) {
        this.logger.log(`Generating CSV report: ${options.title}`);
        try {
            const csvContent = this.generateCsvContent(options.columns, options.data);
            const filename = `${this.sanitizeFilename(options.title)}_${Date.now()}.csv`;
            return {
                buffer: Buffer.from(csvContent),
                filename,
            };
        }
        catch (error) {
            this.logger.error(`CSV generation failed: ${error.message}`);
            throw error;
        }
    }
    simulateExcelGeneration(options) {
        const { title, sheetName, columns, data, includeTimestamp, includeSummary } = options;
        let content = `EXCEL WORKBOOK: ${title}\n`;
        content += `Sheet: ${sheetName || 'Report'}\n`;
        if (includeTimestamp) {
            content += `Generated: ${new Date().toISOString()}\n`;
        }
        content += `\n`;
        content += columns.map((col) => col.label).join('\t') + '\n';
        data.forEach((row) => {
            const values = columns.map((col) => {
                const value = this.getNestedValue(row, col.field);
                return this.formatValue(value, col);
            });
            content += values.join('\t') + '\n';
        });
        if (includeSummary) {
            content += `\n`;
            content += `SUMMARY\n`;
            content += `Total Records: ${data.length}\n`;
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
    generateCsvContent(columns, data) {
        const headers = columns.map((col) => this.escapeCsvValue(col.label));
        const rows = data.map((row) => columns.map((col) => {
            const value = this.getNestedValue(row, col.field);
            return this.escapeCsvValue(this.formatValue(value, col));
        }));
        return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    }
    escapeCsvValue(value) {
        const str = String(value || '');
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    }
    formatValue(value, column) {
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
    calculateAggregate(values, aggregate) {
        if (values.length === 0)
            return 0;
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
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    sanitizeFilename(filename) {
        return filename
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .substring(0, 50);
    }
    applyCellFormatting(workbook, column) {
        const formats = {
            currency: { numFmt: '$#,##0.00' },
            percentage: { numFmt: '0.00%' },
            date: { numFmt: 'yyyy-mm-dd' },
        };
        return formats[column.format || ''] || {};
    }
};
exports.ExcelGeneratorService = ExcelGeneratorService;
exports.ExcelGeneratorService = ExcelGeneratorService = ExcelGeneratorService_1 = __decorate([
    (0, common_1.Injectable)()
], ExcelGeneratorService);
//# sourceMappingURL=excel-generator.service.js.map