import { Prisma, PrismaClient } from '@prisma/client';

// 定义日志接口
export interface Logger {
  log: (message: string) => void;
}

// 定义 Prisma 配置接口
export interface PrismaConfig {
  logger?: Logger;
}

declare global {
  var prisma: PrismaClient | undefined;
}

type PrismaClientWithEvents<ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions> = PrismaClient<
  ClientOptions,
  'query' | 'error' | 'info' | 'warn'
>;

// 创建 Prisma 实例的工厂函数
export function createPrismaClient(config?: PrismaConfig): PrismaClientWithEvents {
  const client = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'info',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
  }) as PrismaClientWithEvents;

  // 如果提供了 logger，立即配置日志
  if (config?.logger) {
    configurePrismaLogs(client, config.logger);
  }
  return client;
}

// 初始化 Prisma 实例
export const prisma = global.prisma || createPrismaClient();

// 配置日志事件
export function configurePrismaLogs(client: PrismaClientWithEvents, logger?: Logger) {
  client.$on('query', e => {
    logger?.log(`Query: ${e.query}`);
  });

  client.$on('error', e => {
    logger?.log(`Error: ${e.message}`);
  });

  client.$on('info', e => {
    logger?.log(`Info: ${e.message}`);
  });

  client.$on('warn', e => {
    logger?.log(`Warn: ${e.message}`);
  });
}

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
