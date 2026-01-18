import { ActionExecutionResult } from '../../schemas/workflow-execution.schema';
export interface SmsActionConfig {
    to: string | string[];
    message: string;
    from?: string;
}
export declare class SmsActionHandler {
    private readonly logger;
    execute(config: SmsActionConfig, triggerData: Record<string, any>): Promise<ActionExecutionResult>;
    private replaceVariables;
    private getNestedValue;
    private simulateSendSms;
}
