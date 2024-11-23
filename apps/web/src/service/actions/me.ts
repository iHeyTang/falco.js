'use server';

import { server } from '@repo/utils';

export const getMe = server<string, null>('getMe', async ctx => {
  ctx.logger.info('Server Action, getMe');
  await new Promise(resolve => setTimeout(resolve, 1000));
  return 'Hello World';
});
