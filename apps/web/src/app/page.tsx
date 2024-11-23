'use client';

import { useAction } from '@repo/utils';
import { getMe } from '@repo/web/service/actions/me';

export default function Home() {
  const { loading, data } = useAction(getMe, null);

  return (
    <div>
      <div>{loading ? 'loading...' : data}</div>
    </div>
  );
}
