import { WorkflowCondition } from '../schemas/workflow.schema';
export declare class ConditionEvaluatorService {
    private readonly logger;
    evaluateConditions(conditions: WorkflowCondition[], data: Record<string, any>): boolean;
    private evaluateCondition;
    private equals;
    private greaterThan;
    private lessThan;
    private contains;
    private isEmpty;
    private toNumber;
    private getNestedValue;
}
