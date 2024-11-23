import { ServiceContextPluginLoader } from '@repo/utils/service-context';
import { loggerPlugin } from './logger';
import { requestPlugin } from './request';

export const plugins: ServiceContextPluginLoader[] = [loggerPlugin, requestPlugin];

