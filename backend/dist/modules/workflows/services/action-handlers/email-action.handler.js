"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EmailActionHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailActionHandler = void 0;
const common_1 = require("@nestjs/common");
let EmailActionHandler = EmailActionHandler_1 = class EmailActionHandler {
    logger = new common_1.Logger(EmailActionHandler_1.name);
    async execute(config, triggerData) {
        const startTime = Date.now();
        try {
            this.logger.log(`Sending email with config: ${JSON.stringify(config)}`);
            const processedConfig = this.replaceVariables(config, triggerData);
            await this.simulateSendEmail(processedConfig);
            return {
                actionType: 'send_email',
                status: 'success',
                message: `Email sent to ${processedConfig.to}`,
                executedAt: new Date(),
                duration: Date.now() - startTime,
            };
        }
        catch (error) {
            this.logger.error(`Email sending failed: ${error.message}`);
            return {
                actionType: 'send_email',
                status: 'failed',
                error: error.message,
                executedAt: new Date(),
                duration: Date.now() - startTime,
            };
        }
    }
    replaceVariables(config, data) {
        const processed = { ...config };
        const replaceInString = (str) => {
            return str.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
                const value = this.getNestedValue(data, path.trim());
                return value !== undefined ? String(value) : match;
            });
        };
        if (typeof processed.subject === 'string') {
            processed.subject = replaceInString(processed.subject);
        }
        if (typeof processed.body === 'string') {
            processed.body = replaceInString(processed.body);
        }
        if (typeof processed.to === 'string') {
            processed.to = replaceInString(processed.to);
        }
        return processed;
    }
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    async simulateSendEmail(config) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        this.logger.log(`[SIMULATED] Email sent to: ${config.to}`);
        this.logger.log(`[SIMULATED] Subject: ${config.subject}`);
    }
};
exports.EmailActionHandler = EmailActionHandler;
exports.EmailActionHandler = EmailActionHandler = EmailActionHandler_1 = __decorate([
    (0, common_1.Injectable)()
], EmailActionHandler);
//# sourceMappingURL=email-action.handler.js.map