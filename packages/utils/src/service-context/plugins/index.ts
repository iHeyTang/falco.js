import { ServiceContextPluginLoader } from '@falcojs/utils/service-context';
import { loggerPlugin } from './logger';
import { requestPlugin } from './request';
import { databasePlugin } from './db';

export const plugins: ServiceContextPluginLoader[] = [loggerPlugin, requestPlugin, databasePlugin];
