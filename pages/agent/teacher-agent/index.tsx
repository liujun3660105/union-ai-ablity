import React from 'react';
import { LayoutWrapper as Layout } from '@/components/layout/root-layout';
import type { ReactElement } from 'react';
import ChatClient from '@/components/chat/chat-client';

export default function Index() {
  function handleRecieveMessage() {}

  return (
    <div className="bg-base-300 h-full">
      <ChatClient
        callback={handleRecieveMessage}
        clientId="12345"
        queryAgentURL="/api/v1/teacher_agent/chat"
        initAIContent="你好，我是June老师，有什么问题可以帮助你吗"
      />
    </div>
  );
}

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
