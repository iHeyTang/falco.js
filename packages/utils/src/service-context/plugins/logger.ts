import { ServiceContextPluginLoader } from '@falcojs/utils/service-context';
import { Logger } from '@falcojs/utils/logger';
import dayjs from 'dayjs';

export const loggerPlugin: ServiceContextPluginLoader = {
  name: 'logger',
  loader: async () => {
    const logger = new Logger({
      level: 'DEBUG',
      format: ({ metadata, message }) => `[${metadata.time}] [${metadata.level}] ${message}`,
      metadata: {
        time: dayjs().toISOString(),
        level: 'DEBUG',
      },
    });

    return logger;
  },
};

declare module '@falcojs/utils/service-context' {
  interface ServiceContextPlugins {
    logger: Logger<any>;
  }
}
