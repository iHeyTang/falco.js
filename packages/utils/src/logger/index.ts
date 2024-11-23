export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
export type LogMeta = Record<string, string>;

export interface LogOutput {
  write(level: LogLevel, message: string): void;
}

export interface LoggerConfig<Meta extends LogMeta = LogMeta> {
  /** 日志格式 */
  format?: (params: { level: LogLevel; message: string; metadata: Meta }) => string;
  /** 日志预设占位值 */
  metadata?: Meta;
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

export class Logger<Meta extends LogMeta = LogMeta> {
  private config: Required<Omit<LoggerConfig<Meta>, 'outputs'>>;
  private outputs: LogOutput[];

  constructor(config: LoggerConfig<Meta>) {
    this.config = {
      format: config.format || (({ message }) => `${message}`),
      metadata: config.metadata || ({} as Meta),
      level: config.level || 'DEBUG',
    };
    this.outputs = config.outputs || [new ConsoleOutput()];
  }

  private formatMessage(level: LogLevel, message: any[]): string {
    return this.config.format({ level, message: message.join(' '), metadata: this.config.metadata });
  }

  public setMetadata(metadata: (prev: Meta) => Meta) {
    this.config.metadata = metadata(this.config.metadata);
  }

  public setFormat(format: (params: { level: LogLevel; message: string; metadata: Meta }) => string) {
    this.config.format = format;
  }

  public info(...message: any[]) {
    this.write('INFO', message);
  }

  public log(...message: any[]) {
    this.write('INFO', message);
  }

  public debug(...message: any[]) {
    this.write('DEBUG', message);
  }

  public error(...message: any[]) {
    this.write('ERROR', message);
  }

  public warn(...message: any[]) {
    this.write('WARN', message);
  }

  private write(level: LogLevel, message: any[]) {
    if (!this.shouldLog(level)) return;
    const formatted = this.formatMessage(level, message);
    this.outputs.forEach(output => output.write(level, formatted));
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_LIST.indexOf(level) >= LOG_LEVEL_LIST.indexOf(this.config.level as LogLevel);
  }

  public clone(config: Partial<LoggerConfig<Meta>> = {}): Logger<Meta> {
    return new Logger({ ...this.config, ...config });
  }
}

/**
 * 当前支持的日志级别
 * DEBUG < INFO < WARN < ERROR
 * 当配置等级为某个值时，只有比这个值高的日志级别才会被打印
 */
const LOG_LEVEL_LIST = ['DEBUG', 'INFO', 'WARN', 'ERROR'] as (typeof process.env.LOG_LEVEL)[];
