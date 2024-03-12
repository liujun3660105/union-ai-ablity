import React, { useContext } from "react";
// import BotAvatar from "./bot-avatar";
import Avatar from './avatar';
import { BeatLoader } from "react-spinners";
import { cn } from "@/utils/style";
// import { ThemeContext } from "./themeProvider";
// import UserAvatar from "@/components/user-avatar";
// import { Button } from "./ui/button";
// import { Copy } from "lucide-react";
import {CopyOutlined as Copy} from '@ant-design/icons'
import {MsgType} from './index'
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import markdownComponents from '../chat-content/config';
import basicComponents from "../chat-content/react-markdown-components";

export interface ChatMessageProps {
  id?:string;
  role: MsgType;
  content?: string;
  src?: string;
  isLoading?: boolean;
}

function formatMarkdownVal(val: string) {
    return val
      .replaceAll('\\n', '\n')
      .replace(/<table(\w*=[^>]+)>/gi, '<table $1>')
      .replace(/<tr(\w*=[^>]+)>/gi, '<tr $1>');
  }

export default function ChatMessage(props: ChatMessageProps) {
  const { role, content, /*src ,*/ isLoading } = props;
  console.log('content',content)
//   const { theme, setTheme } = useContext(ThemeContext);
  const onCopy = () => {
    if (!content) return;
    void navigator.clipboard.writeText(content);
  };
  return (
    <div
      className={cn(
        "group flex w-full items-center gap-x-2 py-4",
        role === "user" && "justify-end",
      )}
    >




      {role !== "user" && <Avatar role='system' />}
      <div className="max-w-sm rounded-md bg-primary/10 px-4 py-2 text-sm w-max flex-initial ">
        {(isLoading && content?.trim().length===0) ?  (
          <BeatLoader size={5} />
        ) : (
            // <div>{content}</div>
            // {formatMarkdownVal(content||'')}
            <ReactMarkdown components={{ ...markdownComponents }} rehypePlugins={[rehypeRaw]}>
                {formatMarkdownVal(content||'')}
            </ReactMarkdown>

          
        )}
      </div>
      {role === "user" && <Avatar role='user' />}
      {role !== "user" && !isLoading && (
        <button
          onClick={onCopy}
          className=" btn btn-sm btn-primary opacity-0 transition group-hover:opacity-100"
        >
          <Copy className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

//判断字符串是否为空
function isEmpty(str: string) {
  return !str || str.trim().length === 0;
}
