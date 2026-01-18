import { ActionExecutionResult } from '../../schemas/workflow-execution.schema';
export interface DatabaseActionConfig {
    collection: string;
    operation: 'create' | 'update' | 'delete';
    data?: Record<string, any>;
    query?: Record<string, any>;
}
export declare class DatabaseActionHandler {
    private readonly logger;
    execute(config: DatabaseActionConfig, triggerData: Record<string, any>): Promise<ActionExecutionResult>;
    private replaceVariables;
    private getNestedValue;
    private simulateDatabaseOperation;
}
