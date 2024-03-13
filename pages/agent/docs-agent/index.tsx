import React, { useState, useCallback } from 'react';
import { Button, Divider, message } from 'antd';
import ConfigForm from './form';
import useChat from '@/hooks/use-chat';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import markdownComponents from '@/components/chat/chat-content/config';
import { CopyFilled } from '@ant-design/icons';

function formatMarkdownVal(val: string) {
  return val
    .replaceAll('\\n', '\n')
    .replace(/<table(\w*=[^>]+)>/gi, '<table $1>')
    .replace(/<tr(\w*=[^>]+)>/gi, '<tr $1>');
}

interface RequirementFormProps {
  api_key: String;
  model: [String, String];
  demand: String;
  directory: String;
  document_type: String;
  wordNumber: number;
}

export default function Index() {
  const { chat, stopSSE } = useChat({ queryAgentURL: '/api/v1/chat/docs-agent' });
  const [competition, setCompetition] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function onFinish(values: RequirementFormProps) {
    console.log('onFinish', values);
    onSend(values);
  }

  const onSend = useCallback((val: RequirementFormProps) => {
    setIsLoading(true);
    console.log('val', val);
    chat({
      data: val,
      // data: { ...data, chat_mode: scene || 'chat_normal', model_name: model, user_input: content },
      // chatId,
      onMessage: (message) => {
        setCompetition(message);
      },
      onClose: () => {
        message.success({
          content: '文档完成创作!',
          duration: 2,
        });
        setIsLoading(false);
        // setCompetition("");
      },
      onError: (msg, e) => {
        message.error({
          content: '请检查api_key,并重新尝试!',
          duration: 2,
        });
        setIsLoading(false);
        // setCompetition("");
      },
    });
  }, []);
  const stop = useCallback(() => {
    stopSSE();
    setIsLoading(false);
  }, []);

  return (
    <div className="flex flex-1 max-h-[calc(100vh-6rem)] gap-1 ">
      <div className=" flex-1 bg-base-300 overflow-y-auto">
        <ConfigForm stop={stop} onFinish={onFinish} loading={isLoading} />
      </div>
      <div className="flex-1 bg-base-300 flex-col">
        {competition.length > 0 && (
          <div className=" text-center flex-none mb-2 align-middle p-4 border-b-2">
            <Button icon={<CopyFilled />}></Button>
          </div>
        )}

        {/* <Divider /> */}
        <div className="overflow-y-auto flex-1 max-h-full ">
          <ReactMarkdown components={{ ...markdownComponents }} rehypePlugins={[rehypeRaw]} className=" mb-2">
            {formatMarkdownVal(competition || '')}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
