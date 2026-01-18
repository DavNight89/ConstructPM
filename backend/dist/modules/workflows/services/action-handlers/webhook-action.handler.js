"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WebhookActionHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookActionHandler = void 0;
const common_1 = require("@nestjs/common");
let WebhookActionHandler = WebhookActionHandler_1 = class WebhookActionHandler {
    logger = new common_1.Logger(WebhookActionHandler_1.name);
    async execute(config, triggerData) {
        const startTime = Date.now();
        try {
            this.logger.log(`Calling webhook: ${config.method} ${config.url}`);
            const processedConfig = this.replaceVariables(config, triggerData);
            await this.simulateWebhookCall(processedConfig);
            return {
                actionType: 'webhook',
                status: 'success',
                message: `Webhook ${processedConfig.method} ${processedConfig.url} completed`,
                executedAt: new Date(),
                duration: Date.now() - startTime,
            };
        }
        catch (error) {
            this.logger.error(`Webhook call failed: ${error.message}`);
            return {
                actionType: 'webhook',
                status: 'failed',
                error: error.message,
                executedAt: new Date(),
                duration: Date.now() - startTime,
            };
        }
    }
    replaceVariables(config, data) {
        const processed = { ...config };
        const replaceInValue = (value) => {
            if (typeof value === 'string') {
                return value.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
                    const val = this.getNestedValue(data, path.trim());
                    return val !== undefined ? val : match;
                });
            }
            if (Array.isArray(value)) {
                return value.map((item) => replaceInValue(item));
            }
            if (value && typeof value === 'object') {
                const result = {};
                for (const key in value) {
                    result[key] = replaceInValue(value[key]);
                }
                return result;
            }
            return value;
        };
        processed.url = replaceInValue(processed.url);
        if (processed.body) {
            processed.body = replaceInValue(processed.body);
        }
        if (processed.headers) {
            processed.headers = replaceInValue(processed.headers);
        }
        return processed;
    }
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    async simulateWebhookCall(config) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        this.logger.log(`[SIMULATED] ${config.method} ${config.url}`);
    }
};
exports.WebhookActionHandler = WebhookActionHandler;
exports.WebhookActionHandler = WebhookActionHandler = WebhookActionHandler_1 = __decorate([
    (0, common_1.Injectable)()
], WebhookActionHandler);
//# sourceMappingURL=webhook-action.handler.js.map