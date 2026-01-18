import { Injectable, Logger } from '@nestjs/common';
import { ActionExecutionResult } from '../../schemas/workflow-execution.schema';

export interface WebhookActionConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

@Injectable()
export class WebhookActionHandler {
  private readonly logger = new Logger(WebhookActionHandler.name);

  async execute(
    config: WebhookActionConfig,
    triggerData: Record<string, any>,
  ): Promise<ActionExecutionResult> {
    const startTime = Date.now();

    try {
      this.logger.log(`Calling webhook: ${config.method} ${config.url}`);

      // Replace template variables
      const processedConfig = this.replaceVariables(config, triggerData);

      // TODO: Use axios or node-fetch to make actual HTTP request
      // For now, simulate webhook call
      await this.simulateWebhookCall(processedConfig);

      return {
        actionType: 'webhook',
        status: 'success',
        message: `Webhook ${processedConfig.method} ${processedConfig.url} completed`,
        executedAt: new Date(),
        duration: Date.now() - startTime,
      };
    } catch (error) {
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

  private replaceVariables(
    config: WebhookActionConfig,
    data: Record<string, any>,
  ): WebhookActionConfig {
    const processed = { ...config };

    const replaceInValue = (value: any): any => {
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
        const result: any = {};
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

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private async simulateWebhookCall(config: WebhookActionConfig): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    this.logger.log(`[SIMULATED] ${config.method} ${config.url}`);
  }
}
