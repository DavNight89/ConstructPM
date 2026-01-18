import { Injectable, Logger } from '@nestjs/common';
import { ActionExecutionResult } from '../../schemas/workflow-execution.schema';

export interface DatabaseActionConfig {
  collection: string;
  operation: 'create' | 'update' | 'delete';
  data?: Record<string, any>;
  query?: Record<string, any>;
}

@Injectable()
export class DatabaseActionHandler {
  private readonly logger = new Logger(DatabaseActionHandler.name);

  async execute(
    config: DatabaseActionConfig,
    triggerData: Record<string, any>,
  ): Promise<ActionExecutionResult> {
    const startTime = Date.now();

    try {
      this.logger.log(`Executing database action: ${JSON.stringify(config)}`);

      // Replace template variables
      const processedConfig = this.replaceVariables(config, triggerData);

      // TODO: Integrate with actual database operations
      // For now, simulate database operation
      await this.simulateDatabaseOperation(processedConfig);

      return {
        actionType: 'update_database',
        status: 'success',
        message: `Database ${processedConfig.operation} operation completed on ${processedConfig.collection}`,
        executedAt: new Date(),
        duration: Date.now() - startTime,
      };
    } catch (error) {
      this.logger.error(`Database action failed: ${error.message}`);
      return {
        actionType: 'update_database',
        status: 'failed',
        error: error.message,
        executedAt: new Date(),
        duration: Date.now() - startTime,
      };
    }
  }

  private replaceVariables(
    config: DatabaseActionConfig,
    data: Record<string, any>,
  ): DatabaseActionConfig {
    const processed = { ...config };

    const replaceInObject = (obj: any): any => {
      if (typeof obj === 'string') {
        return obj.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
          const value = this.getNestedValue(data, path.trim());
          return value !== undefined ? value : match;
        });
      }

      if (Array.isArray(obj)) {
        return obj.map((item) => replaceInObject(item));
      }

      if (obj && typeof obj === 'object') {
        const result: any = {};
        for (const key in obj) {
          result[key] = replaceInObject(obj[key]);
        }
        return result;
      }

      return obj;
    };

    if (processed.data) {
      processed.data = replaceInObject(processed.data);
    }

    if (processed.query) {
      processed.query = replaceInObject(processed.query);
    }

    return processed;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private async simulateDatabaseOperation(
    config: DatabaseActionConfig,
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    this.logger.log(`[SIMULATED] Database ${config.operation} on ${config.collection}`);
  }
}
