import { Snowflake } from '@repo/utils/snowflake';
import { Stopwatch } from '@repo/utils/time';
import axios, { AxiosInstance } from 'axios';
import chalk from 'chalk';

export interface RequestLogger {
  logRequest?: (requestId: string, url: string, data: any) => void;
  logResponse?: (requestId: string, status: number, cost: number, url: string) => void;
}

export class HttpClient {
  private request: AxiosInstance;
  private snowflake: Snowflake;
  private logger: RequestLogger;

  constructor(options?: { logger?: RequestLogger; snowflakeWorkerId?: number; snowflakeDatacenterId?: number }) {
    this.request = axios.create();
    this.snowflake = new Snowflake(options?.snowflakeWorkerId ?? 1, options?.snowflakeDatacenterId ?? 1);

    // 设置默认logger
    this.logger = options?.logger ?? {
      logRequest: (requestId, url, data) => {
        console.log('Request ', requestId, url, JSON.stringify(data));
      },
      logResponse: (requestId, status, cost, url) => {
        console.log('Response', requestId, status, this.formatCost(cost), url);
      },
    };

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.request.interceptors.request.use(async config => {
      const requestId = this.snowflake.nextId();
      (config as any).__requestId = requestId;
      (config as any).__requestStopwatch = new Stopwatch();
      this.logger.logRequest?.(requestId, config.url!, config.data);
      return config;
    });

    this.request.interceptors.response.use(async response => {
      const hash = (response.config as any).__requestId;
      const stopwatch = (response.config as any).__requestStopwatch as Stopwatch;
      const cost = stopwatch.getElapsedMilliseconds();
      this.logger.logResponse?.(hash, response.status, cost, response.config.url!);
      return response;
    });
  }

  private formatCost(cost: number) {
    return cost < 500 ? chalk.green(`${cost}ms`) : chalk.red(`${cost}ms`);
  }

  public async get<T = any>(url: string, config?: any): Promise<T> {
    return (await this.request.get<T>(url, config)).data;
  }

  public async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return (await this.request.post<T>(url, data, config)).data;
  }

  public async put<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return (await this.request.put<T>(url, data, config)).data;
  }

  public async delete<T = any>(url: string, config?: any): Promise<T> {
    return (await this.request.delete<T>(url, config)).data;
  }

  public async patch<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return (await this.request.patch<T>(url, data, config)).data;
  }
}
