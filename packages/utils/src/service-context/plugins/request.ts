import { HttpClient } from '@falcojs/utils/http-client';
import { ServiceContextPluginLoader } from '@falcojs/utils/service-context';

export const requestPlugin: ServiceContextPluginLoader = {
  name: 'request',
  dependencies: ['logger'],
  loader: async context => {
    const client = new HttpClient({
      logger: {
        logRequest: (requestId, url, data) => {
          context.logger.log(`${requestId} ${url}`, data);
        },
        logResponse: (requestId, url, data) => {
          context.logger.log(`${requestId} ${url}`, data);
        },
      },
    });
    return client;
  },
};

declare module '@falcojs/utils/service-context' {
  interface ServiceContextPlugins {
    request: HttpClient;
  }
}
