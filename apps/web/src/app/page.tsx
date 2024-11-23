'use client';

import { useAction } from '@falcojs/utils';
import { getMe } from '@falcojs/web/service/actions/me';

export default function Home() {
  const { loading, data } = useAction(getMe, null);

  return (
    <div>
      <div>{loading ? 'loading...' : data}</div>
    </div>
  );
}
