import { Injectable, Logger } from '@nestjs/common';
import {
  WorkflowCondition,
  ConditionOperator,
} from '../schemas/workflow.schema';

@Injectable()
export class ConditionEvaluatorService {
  private readonly logger = new Logger(ConditionEvaluatorService.name);

  /**
   * Evaluates a list of conditions against provided data
   * @param conditions Array of conditions to evaluate
   * @param data Data to evaluate against
   * @returns true if all conditions pass, false otherwise
   */
  evaluateConditions(
    conditions: WorkflowCondition[],
    data: Record<string, any>,
  ): boolean {
    if (!conditions || conditions.length === 0) {
      return true; // No conditions means always execute
    }

    let result = true;
    let currentOperator: 'AND' | 'OR' = 'AND';

    for (const condition of conditions) {
      const conditionResult = this.evaluateCondition(condition, data);

      if (currentOperator === 'AND') {
        result = result && conditionResult;
      } else {
        result = result || conditionResult;
      }

      // Set operator for next iteration
      currentOperator = condition.logicalOperator || 'AND';

      this.logger.debug(
        `Condition: ${condition.field} ${condition.operator} ${condition.value} = ${conditionResult}`,
      );
    }

    return result;
  }

  /**
   * Evaluates a single condition
   */
  private evaluateCondition(
    condition: WorkflowCondition,
    data: Record<string, any>,
  ): boolean {
    const fieldValue = this.getNestedValue(data, condition.field);
    const conditionValue = condition.value;

    switch (condition.operator) {
      case ConditionOperator.EQUALS:
        return this.equals(fieldValue, conditionValue);

      case ConditionOperator.NOT_EQUALS:
        return !this.equals(fieldValue, conditionValue);

      case ConditionOperator.GREATER_THAN:
        return this.greaterThan(fieldValue, conditionValue);

      case ConditionOperator.LESS_THAN:
        return this.lessThan(fieldValue, conditionValue);

      case ConditionOperator.CONTAINS:
        return this.contains(fieldValue, conditionValue);

      case ConditionOperator.NOT_CONTAINS:
        return !this.contains(fieldValue, conditionValue);

      case ConditionOperator.IS_EMPTY:
        return this.isEmpty(fieldValue);

      case ConditionOperator.IS_NOT_EMPTY:
        return !this.isEmpty(fieldValue);

      default:
        this.logger.warn(`Unknown operator: ${condition.operator}`);
        return false;
    }
  }

  private equals(a: any, b: any): boolean {
    // Handle null/undefined
    if (a === null || a === undefined) {
      return b === null || b === undefined;
    }

    // Handle arrays
    if (Array.isArray(a) && Array.isArray(b)) {
      return JSON.stringify(a) === JSON.stringify(b);
    }

    // Handle objects
    if (typeof a === 'object' && typeof b === 'object') {
      return JSON.stringify(a) === JSON.stringify(b);
    }

    // Handle primitives with type coercion
    return String(a).toLowerCase() === String(b).toLowerCase();
  }

  private greaterThan(a: any, b: any): boolean {
    const numA = this.toNumber(a);
    const numB = this.toNumber(b);

    if (numA === null || numB === null) {
      return false;
    }

    return numA > numB;
  }

  private lessThan(a: any, b: any): boolean {
    const numA = this.toNumber(a);
    const numB = this.toNumber(b);

    if (numA === null || numB === null) {
      return false;
    }

    return numA < numB;
  }

  private contains(a: any, b: any): boolean {
    if (typeof a === 'string' && typeof b === 'string') {
      return a.toLowerCase().includes(b.toLowerCase());
    }

    if (Array.isArray(a)) {
      return a.some((item) => this.equals(item, b));
    }

    return false;
  }

  private isEmpty(value: any): boolean {
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

  private toNumber(value: any): number | null {
    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? null : parsed;
    }

    return null;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current?.[key];
    }, obj);
  }
}
