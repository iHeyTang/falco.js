import { createPrismaClient, PrismaClientWithEvents } from '@falcojs/persistence';
import { ServiceContextPluginLoader } from '@falcojs/utils/service-context';

export const databasePlugin: ServiceContextPluginLoader = {
  name: 'db',
  loader: async ctx => {
    const db = createPrismaClient({ logger: ctx.logger });
    return db;
  },
};

declare module '@falcojs/utils/service-context' {
  interface ServiceContextPlugins {
    db: PrismaClientWithEvents;
  }
}
