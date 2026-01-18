"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DatabaseActionHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseActionHandler = void 0;
const common_1 = require("@nestjs/common");
let DatabaseActionHandler = DatabaseActionHandler_1 = class DatabaseActionHandler {
    logger = new common_1.Logger(DatabaseActionHandler_1.name);
    async execute(config, triggerData) {
        const startTime = Date.now();
        try {
            this.logger.log(`Executing database action: ${JSON.stringify(config)}`);
            const processedConfig = this.replaceVariables(config, triggerData);
            await this.simulateDatabaseOperation(processedConfig);
            return {
                actionType: 'update_database',
                status: 'success',
                message: `Database ${processedConfig.operation} operation completed on ${processedConfig.collection}`,
                executedAt: new Date(),
                duration: Date.now() - startTime,
            };
        }
        catch (error) {
            this.logger.error(`Database action failed: ${error.message}`);
            return {
                actionType: 'update_database',
                status: 'failed',
                error: error.message,
                executedAt: new Date(),
                duration: Date.now() - startTime,
            };
        }
    }
    replaceVariables(config, data) {
        const processed = { ...config };
        const replaceInObject = (obj) => {
            if (typeof obj === 'string') {
                return obj.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
                    const value = this.getNestedValue(data, path.trim());
                    return value !== undefined ? value : match;
                });
            }
            if (Array.isArray(obj)) {
                return obj.map((item) => replaceInObject(item));
            }
            if (obj && typeof obj === 'object') {
                const result = {};
                for (const key in obj) {
                    result[key] = replaceInObject(obj[key]);
                }
                return result;
            }
            return obj;
        };
        if (processed.data) {
            processed.data = replaceInObject(processed.data);
        }
        if (processed.query) {
            processed.query = replaceInObject(processed.query);
        }
        return processed;
    }
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    async simulateDatabaseOperation(config) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        this.logger.log(`[SIMULATED] Database ${config.operation} on ${config.collection}`);
    }
};
exports.DatabaseActionHandler = DatabaseActionHandler;
exports.DatabaseActionHandler = DatabaseActionHandler = DatabaseActionHandler_1 = __decorate([
    (0, common_1.Injectable)()
], DatabaseActionHandler);
//# sourceMappingURL=database-action.handler.js.map