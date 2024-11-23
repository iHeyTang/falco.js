import { createContext as createServiceContext, ServiceContext } from '@repo/utils/service-context';
import { Snowflake } from '@repo/utils/snowflake';
import { Stopwatch } from '@repo/utils/time';
import chalk from 'chalk';
import { NextRequest, NextResponse } from 'next/server';

const snowflake = new Snowflake(1, 1);

export const webhook = <R, T>(handler: (context: ServiceContext<T>, request: NextRequest) => Promise<R>) => {
  return async (request: NextRequest) => {
    const stopwatch = new Stopwatch();
    const payload = (await request.json()) as T;
    const requestIp = request.headers.get('x-forwarded-for');

    const ctx = await createServiceContext({ data: payload });
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
      ctx.logger.log(`${request.url} start`, JSON.stringify(payload));
      const data = await handler(ctx, request);
      ctx.logger.log(`${request.url} success`, data, cc(stopwatch.getElapsedMilliseconds()));
      return NextResponse.json({ success: true, data });
    } catch (e: any) {
      ctx.logger.error(`${request.url} error`, JSON.stringify(e), cc(stopwatch.getElapsedMilliseconds()));
      if (e.message.includes('Unauthorized')) {
        return NextResponse.json({ success: false, code: 401, message: e.message, data: null });
      }
      return NextResponse.json({ success: false, code: 500, message: e.message, data: null });
    }
  };
};

const cc = (cost: number) => (cost < 500 ? chalk.green(`${cost}ms`) : chalk.red(`${cost}ms`));
