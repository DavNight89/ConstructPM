"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ConditionEvaluatorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionEvaluatorService = void 0;
const common_1 = require("@nestjs/common");
const workflow_schema_1 = require("../schemas/workflow.schema");
let ConditionEvaluatorService = ConditionEvaluatorService_1 = class ConditionEvaluatorService {
    logger = new common_1.Logger(ConditionEvaluatorService_1.name);
    evaluateConditions(conditions, data) {
        if (!conditions || conditions.length === 0) {
            return true;
        }
        let result = true;
        let currentOperator = 'AND';
        for (const condition of conditions) {
            const conditionResult = this.evaluateCondition(condition, data);
            if (currentOperator === 'AND') {
                result = result && conditionResult;
            }
            else {
                result = result || conditionResult;
            }
            currentOperator = condition.logicalOperator || 'AND';
            this.logger.debug(`Condition: ${condition.field} ${condition.operator} ${condition.value} = ${conditionResult}`);
        }
        return result;
    }
    evaluateCondition(condition, data) {
        const fieldValue = this.getNestedValue(data, condition.field);
        const conditionValue = condition.value;
        switch (condition.operator) {
            case workflow_schema_1.ConditionOperator.EQUALS:
                return this.equals(fieldValue, conditionValue);
            case workflow_schema_1.ConditionOperator.NOT_EQUALS:
                return !this.equals(fieldValue, conditionValue);
            case workflow_schema_1.ConditionOperator.GREATER_THAN:
                return this.greaterThan(fieldValue, conditionValue);
            case workflow_schema_1.ConditionOperator.LESS_THAN:
                return this.lessThan(fieldValue, conditionValue);
            case workflow_schema_1.ConditionOperator.CONTAINS:
                return this.contains(fieldValue, conditionValue);
            case workflow_schema_1.ConditionOperator.NOT_CONTAINS:
                return !this.contains(fieldValue, conditionValue);
            case workflow_schema_1.ConditionOperator.IS_EMPTY:
                return this.isEmpty(fieldValue);
            case workflow_schema_1.ConditionOperator.IS_NOT_EMPTY:
                return !this.isEmpty(fieldValue);
            default:
                this.logger.warn(`Unknown operator: ${condition.operator}`);
                return false;
        }
    }
    equals(a, b) {
        if (a === null || a === undefined) {
            return b === null || b === undefined;
        }
        if (Array.isArray(a) && Array.isArray(b)) {
            return JSON.stringify(a) === JSON.stringify(b);
        }
        if (typeof a === 'object' && typeof b === 'object') {
            return JSON.stringify(a) === JSON.stringify(b);
        }
        return String(a).toLowerCase() === String(b).toLowerCase();
    }
    greaterThan(a, b) {
        const numA = this.toNumber(a);
        const numB = this.toNumber(b);
        if (numA === null || numB === null) {
            return false;
        }
        return numA > numB;
    }
    lessThan(a, b) {
        const numA = this.toNumber(a);
        const numB = this.toNumber(b);
        if (numA === null || numB === null) {
            return false;
        }
        return numA < numB;
    }
    contains(a, b) {
        if (typeof a === 'string' && typeof b === 'string') {
            return a.toLowerCase().includes(b.toLowerCase());
        }
        if (Array.isArray(a)) {
            return a.some((item) => this.equals(item, b));
        }
        return false;
    }
    isEmpty(value) {
        if (value === null || value === undefined) {
            return true;
        }
        if (typeof value === 'string') {
            return value.trim() === '';
        }
        if (Array.isArray(value)) {
            return value.length === 0;
        }
        if (typeof value === 'object') {
            return Object.keys(value).length === 0;
        }
        return false;
    }
    toNumber(value) {
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'string') {
            const parsed = parseFloat(value);
            return isNaN(parsed) ? null : parsed;
        }
        return null;
    }
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current?.[key];
        }, obj);
    }
};
exports.ConditionEvaluatorService = ConditionEvaluatorService;
exports.ConditionEvaluatorService = ConditionEvaluatorService = ConditionEvaluatorService_1 = __decorate([
    (0, common_1.Injectable)()
], ConditionEvaluatorService);
//# sourceMappingURL=condition-evaluator.service.js.map