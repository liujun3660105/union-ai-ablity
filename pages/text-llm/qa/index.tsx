import React from 'react';
import { LayoutWrapper as Layout } from '@/components/layout/root-layout';
import type { ReactElement } from 'react';

export default function Index() {
  return (
    <div className="h-full">
      <iframe src="http://211.94.218.104:3000/" className="w-full h-full" />
    </div>
  );
}

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
