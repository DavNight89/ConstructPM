import { Injectable, Logger } from '@nestjs/common';
import { ActionExecutionResult } from '../../schemas/workflow-execution.schema';

export interface SmsActionConfig {
  to: string | string[];
  message: string;
  from?: string;
}

@Injectable()
export class SmsActionHandler {
  private readonly logger = new Logger(SmsActionHandler.name);

  async execute(
    config: SmsActionConfig,
    triggerData: Record<string, any>,
  ): Promise<ActionExecutionResult> {
    const startTime = Date.now();

    try {
      this.logger.log(`Sending SMS with config: ${JSON.stringify(config)}`);

      // Replace template variables
      const processedConfig = this.replaceVariables(config, triggerData);

      // TODO: Integrate with Twilio or other SMS service
      // For now, simulate sending
      await this.simulateSendSms(processedConfig);

      return {
        actionType: 'send_sms',
        status: 'success',
        message: `SMS sent to ${processedConfig.to}`,
        executedAt: new Date(),
        duration: Date.now() - startTime,
      };
    } catch (error) {
      this.logger.error(`SMS sending failed: ${error.message}`);
      return {
        actionType: 'send_sms',
        status: 'failed',
        error: error.message,
        executedAt: new Date(),
        duration: Date.now() - startTime,
      };
    }
  }

  private replaceVariables(
    config: SmsActionConfig,
    data: Record<string, any>,
  ): SmsActionConfig {
    const processed = { ...config };

    const replaceInString = (str: string): string => {
      return str.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
        const value = this.getNestedValue(data, path.trim());
        return value !== undefined ? String(value) : match;
      });
    };

    if (typeof processed.message === 'string') {
      processed.message = replaceInString(processed.message);
    }

    if (typeof processed.to === 'string') {
      processed.to = replaceInString(processed.to);
    }

    return processed;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private async simulateSendSms(config: SmsActionConfig): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    this.logger.log(`[SIMULATED] SMS sent to: ${config.to}`);
    this.logger.log(`[SIMULATED] Message: ${config.message}`);
  }
}
