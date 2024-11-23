import chalk from 'chalk';
import dayjs from 'dayjs';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
export type LogMeta = Record<string, string>;

export interface LogOutput {
  write(level: LogLevel, message: string): void;
}

export interface LoggerConfig {
  /** 日志格式 */
  format?: string;
  /** 日志预设占位值 */
  formatMeta?: LogMeta;
  /** 日志输出方式 */
  outputs?: LogOutput[];
  /** 日志等级 配置等级后，只有等于或高于该等级的日志会被打印 */
  level?: LogLevel;
}

export class ConsoleOutput implements LogOutput {
  write(level: LogLevel, message: string) {
    switch (level) {
      case 'ERROR':
        console.error(message);
        break;
      case 'WARN':
        console.warn(message);
        break;
      default:
        console.log(message);
    }
  }
}

export class Logger {
  config: Required<Omit<LoggerConfig, 'outputs'>>;
  private tails: string[] = [];
  private outputs: LogOutput[];

  constructor(config: LoggerConfig) {
    this.config = {
      format: config.format || '[{time}]',
      formatMeta: config.formatMeta || {},
      level: config.level || 'DEBUG',
    };
    this.outputs = config.outputs || [new ConsoleOutput()];
  }

  private formatMessage(message: any[]): string {
    const time = dayjs().toISOString();

    let formatted = this.config.format;

    formatted = formatted.replace(`{time}`, time);
    for (const metaKey of Object.keys(this.config.formatMeta)) {
      formatted = formatted.replace(`{${metaKey}}`, this.config.formatMeta[metaKey] || '-');
    }
    const tail = this.tails.length ? ` ${this.tails.map(t => `[${t}]`).join(' ')}` : '';
    return chalk`${formatted}${tail} ${message.join(' ')}`;
  }

  _push(...message: any[]) {
    this.tails.push(...message);
  }

  _pop() {
    return this.tails.pop();
  }

  log(...message: any[]) {
    this.write('INFO', message);
  }

  debug(...message: any[]) {
    this.write('DEBUG', message);
  }

  error(...message: any[]) {
    this.write('ERROR', message);
  }

  warn(...message: any[]) {
    this.write('WARN', message);
  }

  private write(level: LogLevel, message: any[]) {
    if (!this.shouldLog(level)) return;
    const formatted = this.formatMessage(message);
    this.outputs.forEach(output => output.write(level, formatted));
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_LIST.indexOf(level) >= LOG_LEVEL_LIST.indexOf(this.config.level as LogLevel);
  }

  clone(config: Partial<LoggerConfig> = {}): Logger {
    return new Logger({ ...this.config, ...config });
  }
}

/**
 * 当前支持的日志级别
 * DEBUG < INFO < WARN < ERROR
 * 当配置等级为某个值时，只有比这个值高的日志级别才会被打印
 */
const LOG_LEVEL_LIST = ['DEBUG', 'INFO', 'WARN', 'ERROR'] as (typeof process.env.LOG_LEVEL)[];
