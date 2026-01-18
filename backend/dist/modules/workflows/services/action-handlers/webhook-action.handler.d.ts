import { ActionExecutionResult } from '../../schemas/workflow-execution.schema';
export interface WebhookActionConfig {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
}
export declare class WebhookActionHandler {
    private readonly logger;
    execute(config: WebhookActionConfig, triggerData: Record<string, any>): Promise<ActionExecutionResult>;
    private replaceVariables;
    private getNestedValue;
    private simulateWebhookCall;
}
