"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PdfGeneratorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfGeneratorService = void 0;
const common_1 = require("@nestjs/common");
let PdfGeneratorService = PdfGeneratorService_1 = class PdfGeneratorService {
    logger = new common_1.Logger(PdfGeneratorService_1.name);
    async generatePdf(options) {
        this.logger.log(`Generating PDF report: ${options.title}`);
        try {
            const pdfContent = this.simulatePdfGeneration(options);
            const filename = `${this.sanitizeFilename(options.title)}_${Date.now()}.pdf`;
            return {
                buffer: Buffer.from(pdfContent),
                filename,
            };
        }
        catch (error) {
            this.logger.error(`PDF generation failed: ${error.message}`);
            throw error;
        }
    }
    simulatePdfGeneration(options) {
        const { title, subtitle, columns, data, styling } = options;
        let content = `PDF REPORT: ${title}\n`;
        if (subtitle) {
            content += `Subtitle: ${subtitle}\n`;
        }
        content += `Generated: ${new Date().toISOString()}\n`;
        content += `Orientation: ${styling?.orientation || 'portrait'}\n`;
        content += `Page Size: ${styling?.pageSize || 'A4'}\n`;
        content += `\n`;
        content += columns.map((col) => col.label).join(' | ') + '\n';
        content += '-'.repeat(80) + '\n';
        data.forEach((row) => {
            const values = columns.map((col) => {
                const value = this.getNestedValue(row, col.field);
                return this.formatValue(value, col);
            });
            content += values.join(' | ') + '\n';
        });
        content += `\n`;
        content += `Total Records: ${data.length}\n`;
        content += `Page 1 of 1\n`;
        this.logger.log(`[SIMULATED] PDF generated with ${data.length} records`);
        return content;
    }
    formatTable(columns, data) {
        return {
            headers: columns.map((col) => col.label),
            rows: data.map((row) => columns.map((col) => {
                const value = this.getNestedValue(row, col.field);
                return this.formatValue(value, col);
            })),
        };
    }
    formatValue(value, column) {
        if (value === null || value === undefined) {
            return '';
        }
        switch (column.type) {
            case 'date':
                return new Date(value).toLocaleDateString();
            case 'number':
                if (column.format === 'currency') {
                    return `$${Number(value).toFixed(2)}`;
                }
                if (column.format === 'percentage') {
                    return `${Number(value).toFixed(2)}%`;
                }
                return String(value);
            case 'boolean':
                return value ? 'Yes' : 'No';
            case 'string':
            default:
                return String(value);
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
    calculatePageCount(recordCount, recordsPerPage = 30) {
        return Math.ceil(recordCount / recordsPerPage);
    }
};
exports.PdfGeneratorService = PdfGeneratorService;
exports.PdfGeneratorService = PdfGeneratorService = PdfGeneratorService_1 = __decorate([
    (0, common_1.Injectable)()
], PdfGeneratorService);
//# sourceMappingURL=pdf-generator.service.js.map