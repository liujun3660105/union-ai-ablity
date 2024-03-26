import React, { useEffect, useState, useRef, type ElementRef } from 'react';
// import { type MessageProps } from "@/lib/memory";
import ChatMessage, { type ChatMessageProps } from './chat-message';
interface ChatMessagesProps {
  isLoading: boolean;
  // companion: Companion;
  messages: ChatMessageProps[];
  competition: string; // AI正在回答的内容，是一个文本流
}

function ChatMessages(props: ChatMessagesProps) {
  const scrollRef = useRef<ElementRef<'div'>>(null);
  const { isLoading, messages, competition } = props;
  const [fakeLoading, setFakeLoading] = useState<boolean>(messages.length === 0 ? true : false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFakeLoading(false);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [competition, messages]);
  return (
    <div className="flex-1 overflow-y-auto pr-4">
      <ChatMessage
        role="system"
        isLoading={fakeLoading}
        src=""
        content={`我是地图智能助手，有什么可以帮助你的吗？`}
        // content={'当然可以，以下是一个基本的SQL查询语句，用于从名为"road"的表中查询id为1的记录：\n\n```SQL\nSELECT * \nFROM road \nWHERE id = 1;\n```\n\n这个查询会返回road表中id为1的所有列（如果只需要特定列，你可以将`*`替换为列名）。如果你使用的是数据库管理系统如MySQL、PostgreSQL、Oracle等，语法可能会有些许差异，但基本结构是一样的。'}
      />
      {messages.map((message) => (
        <ChatMessage key={message.id} role={message.role} src="" content={message.content} />
      ))}
      {isLoading && <ChatMessage role="system" isLoading src="" content={competition} />}
      <div ref={scrollRef}></div>
    </div>
  );
}
export default ChatMessages;
