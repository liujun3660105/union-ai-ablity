import React,{useCallback, useState} from "react";
import { Input } from "antd";
import {SendOutlined,LoadingOutlined} from '@ant-design/icons';

interface ChatInputProps{
    loading:boolean;
    onSend:(msg:string)=>void;
}

export default function ChatInput(props:ChatInputProps) {
    const {loading,onSend} = props;
    const [val,setVal] = useState<string>();
    function onSendMsg(){
        setVal(undefined);
        onSend(val||'')
    }
  return (
    <div className="flex flex-none items-center border-t border-primary/10 py-4">
      <Input value={val} onChange={(e)=>{setVal(e.target.value)}} onPressEnter={onSendMsg} suffix={!loading?<SendOutlined onClick={onSendMsg} className=" cursor-pointer" />:<LoadingOutlined/>} />
      {/* <Input/> */}
    </div>
  );
}
