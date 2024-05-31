import React from 'react';
import type { Metadata } from 'next';
import { LayoutWrapper as Layout } from '@/components/layout/root-layout';
import type { ReactElement } from 'react';

export const metadata: Metadata = {
  title: '联通大模型',
  description: '联通大模型能力展示平台',
};

export default function Index() {
  return (
    <div className="h-full">
      <p>图片生成</p>
    </div>
  );
}
Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
