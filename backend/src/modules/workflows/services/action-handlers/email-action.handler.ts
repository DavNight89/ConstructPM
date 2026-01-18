import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class EmailActionHandler {
  private readonly logger = new Logger(EmailActionHandler.name);

  async execute(
    config: EmailActionConfig,
    triggerData: Record<string, any>,
  ): Promise<ActionExecutionResult> {
    const startTime = Date.now();

    try {
      this.logger.log(`Sending email with config: ${JSON.stringify(config)}`);

      // Replace template variables in config
      const processedConfig = this.replaceVariables(config, triggerData);

      // TODO: Integrate with actual email service (NodeMailer)
      // For now, simulate sending
      await this.simulateSendEmail(processedConfig);

      return {
        actionType: 'send_email',
        status: 'success',
        message: `Email sent to ${processedConfig.to}`,
        executedAt: new Date(),
        duration: Date.now() - startTime,
      };
    } catch (error) {
      this.logger.error(`Email sending failed: ${error.message}`);
      return {
        actionType: 'send_email',
        status: 'failed',
        error: error.message,
        executedAt: new Date(),
        duration: Date.now() - startTime,
      };
    }
  }

  private replaceVariables(
    config: EmailActionConfig,
    data: Record<string, any>,
  ): EmailActionConfig {
    const processed = { ...config };

    // Replace {{variable}} syntax with actual values
    const replaceInString = (str: string): string => {
      return str.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
        const value = this.getNestedValue(data, path.trim());
        return value !== undefined ? String(value) : match;
      });
    };

    if (typeof processed.subject === 'string') {
      processed.subject = replaceInString(processed.subject);
    }

    if (typeof processed.body === 'string') {
      processed.body = replaceInString(processed.body);
    }

    if (typeof processed.to === 'string') {
      processed.to = replaceInString(processed.to);
    }

    return processed;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private async simulateSendEmail(config: EmailActionConfig): Promise<void> {
    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    this.logger.log(`[SIMULATED] Email sent to: ${config.to}`);
    this.logger.log(`[SIMULATED] Subject: ${config.subject}`);
  }
}
