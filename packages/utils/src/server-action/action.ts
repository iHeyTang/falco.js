'use client';

import { parseJson } from '../json';
import { ActionPayload, ServerActionWrapper } from './server';
import { useState, useEffect, useMemo } from 'react';

export type ActionResult<T extends ServerActionWrapper<any, any>> = NonNullable<Awaited<ReturnType<T>>['data']>;
export type ActionParams<T extends ServerActionWrapper<any, any>> = Parameters<T>[0];

type IActionReturn<R, P> = ReturnType<ServerActionWrapper<R, P>>;

export async function action<R, P>(action: ServerActionWrapper<R, P>, data: P): IActionReturn<R, P> {
  const payload: ActionPayload<P> = { authorization: `Bearer ${localStorage.getItem('token')}`, data };
  const res = await action(payload);
  return res;
}

export function useAction<R, P>(handler: ServerActionWrapper<R, P>, params: P) {
  const [data, setData] = useState<R | null>();
  const [loading, setLoading] = useState(false);

  const paramString = JSON.stringify(params);

  useEffect(() => {
    setLoading(true);
    action(handler, parseJson(paramString) || ({} as P)).then(res => {
      setData(res.data);
      setLoading(false);
    });
  }, [paramString]);

  return useMemo(() => ({ data, loading }), [data, loading]);
}
