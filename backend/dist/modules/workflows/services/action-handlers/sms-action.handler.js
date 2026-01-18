"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SmsActionHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsActionHandler = void 0;
const common_1 = require("@nestjs/common");
let SmsActionHandler = SmsActionHandler_1 = class SmsActionHandler {
    logger = new common_1.Logger(SmsActionHandler_1.name);
    async execute(config, triggerData) {
        const startTime = Date.now();
        try {
            this.logger.log(`Sending SMS with config: ${JSON.stringify(config)}`);
            const processedConfig = this.replaceVariables(config, triggerData);
            await this.simulateSendSms(processedConfig);
            return {
                actionType: 'send_sms',
                status: 'success',
                message: `SMS sent to ${processedConfig.to}`,
                executedAt: new Date(),
                duration: Date.now() - startTime,
            };
        }
        catch (error) {
            this.logger.error(`SMS sending failed: ${error.message}`);
            return {
                actionType: 'send_sms',
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
        if (typeof processed.message === 'string') {
            processed.message = replaceInString(processed.message);
        }
        if (typeof processed.to === 'string') {
            processed.to = replaceInString(processed.to);
        }
        return processed;
    }
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    async simulateSendSms(config) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        this.logger.log(`[SIMULATED] SMS sent to: ${config.to}`);
        this.logger.log(`[SIMULATED] Message: ${config.message}`);
    }
};
exports.SmsActionHandler = SmsActionHandler;
exports.SmsActionHandler = SmsActionHandler = SmsActionHandler_1 = __decorate([
    (0, common_1.Injectable)()
], SmsActionHandler);
//# sourceMappingURL=sms-action.handler.js.map