import React from 'react';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: '联通大模型',
  description: '联通大模型能力展示平台',
};

export default function index() {
  return (
    <div className="h-full">
      <iframe src="http://211.94.218.104:7860/" className="w-full h-full" />
    </div>
  );
}
