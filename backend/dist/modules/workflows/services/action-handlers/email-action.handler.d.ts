import { ActionExecutionResult } from '../../schemas/workflow-execution.schema';
export interface EmailActionConfig {
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    template?: string;
    body?: string;
    attachments?: any[];
}
export declare class EmailActionHandler {
    private readonly logger;
    execute(config: EmailActionConfig, triggerData: Record<string, any>): Promise<ActionExecutionResult>;
    private replaceVariables;
    private getNestedValue;
    private simulateSendEmail;
}
