import { createContext as createServiceContext, ServiceContext } from '@repo/utils/service-context';
import { Snowflake } from '@repo/utils/snowflake';
import { Stopwatch } from '@repo/utils/time';
import chalk from 'chalk';

export type ActionPayload<T> = {
  authorization?: string;
  data: T;
};

export type ServerAction<R, P> = (data: ServiceContext<P>) => Promise<R>;

export type ServerActionWrapper<R, P> = (
  payload: ActionPayload<P>,
  context?: ServiceContext<P>
) => Promise<{ success: true; code: undefined; message: undefined; data: R } | { success: false; code: number; message: string; data: null }>;

const snowflake = new Snowflake(1, 1);

export function server<R = unknown, P = unknown>(name: string, action: ServerAction<R, P>): ServerActionWrapper<R, P> {
  return async (payload: ActionPayload<P>) => {
    const { headers } = await import('next/headers');
    const stopwatch = new Stopwatch();
    const header = await headers();
    const requestIp = header.get('x-forwarded-for');

    const ctx = await createServiceContext<P>({ data: payload.data });
    ctx.logger.setMetadata(prev => ({
      ...prev,
      requestId: snowflake.nextId(),
      requestIp: requestIp || '-',
    }));
    ctx.logger.setFormat(({ level, message, metadata }) => {
      const highlight = level === 'ERROR' ? chalk.red : level === 'WARN' ? chalk.yellow : chalk.blue;
      return `${highlight(`[${metadata.time}] [${metadata.requestId}] [${metadata.requestIp}]`)} ${message}`;
    });

    try {
      stopwatch.start();
      ctx.logger.log(`${name} start`, JSON.stringify(payload.data));
      const data = await action(ctx);
      ctx.logger.log(`${name} success`, data, cc(stopwatch.getElapsedMilliseconds()));
      return { success: true, data };
    } catch (e: any) {
      ctx.logger.error(`${name} error`, JSON.stringify(e), cc(stopwatch.getElapsedMilliseconds()));
      if (e.message.includes('Unauthorized')) {
        return { success: false, code: 401, message: e.message, data: null };
      }
      return { success: false, code: 500, message: e.message, data: null };
    }
  };
}

const cc = (cost: number) => (cost < 500 ? chalk.green(`${cost}ms`) : chalk.red(`${cost}ms`));
