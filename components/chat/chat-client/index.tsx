import React, { useState, useCallback } from 'react';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';
import useChat from '@/hooks/use-chat';
import { ChatMessageProps } from './chat-message';

export type MsgType = 'user' | 'assistant' | 'system';

// interface MessageProps{
//     id:string;
//     content:string;
//     time:string|number;
//     type:MsgType;
// }

interface ChatClientProps {
  callback?: (v: string) => void;
}

export default function ChatClient(props: ChatClientProps) {
  const { callback } = props;
  const { chat, stopSSE } = useChat({ queryAgentURL: '/api/v1/chat/map-interact' });
  const [competition, setCompetition] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const onSend = useCallback((val: string) => {
    let systemResponseMessage = '';
    setIsLoading(true);
    const userMessage: ChatMessageProps = {
      id: Date.now().toString(),
      role: 'user',
      content: val,
    };
    // return;
    setMessages((current) => [...current, userMessage]);

    console.log('val', val);
    chat({
      data: { query: val },

      onMessage: (message) => {
        systemResponseMessage = message;
        setCompetition(message);
      },
      onClose: () => {
        console.log('systemResponseMessage', systemResponseMessage);
        setIsLoading(false);
        const systemMessage: ChatMessageProps = {
          id: Date.now().toString(),
          role: 'system',
          content: systemResponseMessage,
        };
        setMessages((current) => [...current, systemMessage]);
        setCompetition('');
        debugger;
        callback && callback(systemResponseMessage);
      },
      onError: (_message) => {
        setIsLoading(false);
        const systemMessage: ChatMessageProps = {
          id: Date.now().toString(),
          role: 'system',
          content: systemResponseMessage,
        };
        setMessages((current) => [...current, systemMessage]);
        setCompetition('');
      },
    });
  }, []);

  return (
    <div className=" flex h-[100vh] flex-col space-y-2 p-4">
      <ChatMessages messages={messages} isLoading={isLoading} competition={competition} />
      <ChatInput onSend={onSend} loading={isLoading} />
      {/* (
      <>
        <ChatMessages messages={messages} isLoading={isLoading} competition={competition} />
        <ChatForm isLoading={isLoading} onSubmit={onSubmit} />
      </>
    ) */}
    </div>
  );
}
