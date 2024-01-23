import { useRequest } from 'ahooks';
import { useContext, useState } from 'react';
import { Button, Divider, Spin, Tag } from 'antd';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { NextPage } from 'next';
import { apiInterceptors, newDialogue, postScenes } from '@/client/api';
import ModelSelector from '@/components/chat/header/model-selector';
import { ChatContext } from '@/context/chat-context';
import { SceneResponse } from '@/types/chat';
import CompletionInput from '@/components/common/completion-input';
import { useTranslation } from 'react-i18next';
import { STORAGE_INIT_MESSAGE_KET } from '@/utils';
import Icon from '@ant-design/icons/lib/components/Icon';
import { ColorfulDB, ColorfulPlugin, ColorfulDashboard, ColorfulData, ColorfulExcel, ColorfulDoc, ColorfulChat } from '@/components/icons';
import classNames from 'classnames';
const Home: NextPage = () => {
  const router = useRouter();
  const { model, setModel } = useContext(ChatContext);
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [chatSceneLoading, setChatSceneLoading] = useState<boolean>(false);

  const { data: scenesList = [] } = useRequest(
    async () => {
      setChatSceneLoading(true);
      const [, res] = await apiInterceptors(postScenes());
      setChatSceneLoading(false);
      return res ?? [];
    },
    {
      manual: true,
    },
  );

  const submit = async (message: string) => {
    setLoading(true);
    const [, res] = await apiInterceptors(newDialogue({ chat_mode: 'chat_normal' }));
    if (res) {
      localStorage.setItem(STORAGE_INIT_MESSAGE_KET, JSON.stringify({ id: res.conv_uid, message }));
      router.push(`/chat/?scene=chat_normal&id=${res.conv_uid}${model ? `&model=${model}` : ''}`);
    }
    setLoading(false);
  };

  const handleNewChat = async (scene: SceneResponse) => {
    if (scene.show_disable) return;
    const [, res] = await apiInterceptors(newDialogue({ chat_mode: 'chat_normal' }));
    if (res) {
      router.push(`/chat?scene=${scene.chat_scene}&id=${res.conv_uid}${model ? `&model=${model}` : ''}`);
    }
  };

  function renderSceneIcon(scene: string) {
    switch (scene) {
      case 'chat_knowledge':
        return <Icon className="w-10 h-10 mr-4 p-1" component={ColorfulDoc} />;
      case 'chat_with_db_execute':
        return <Icon className="w-10 h-10 mr-4 p-1" component={ColorfulData} />;
      case 'chat_excel':
        return <Icon className="w-10 h-10 mr-4 p-1" component={ColorfulExcel} />;
      case 'chat_with_db_qa':
        return <Icon className="w-10 h-10 mr-4 p-1" component={ColorfulDB} />;
      case 'chat_dashboard':
        return <Icon className="w-10 h-10 mr-4 p-1" component={ColorfulDashboard} />;
      case 'chat_agent':
        return <Icon className="w-10 h-10 mr-4 p-1" component={ColorfulPlugin} />;
      case 'dbgpt_chat':
        return <Icon className="w-10 h-10 mr-4 p-1" component={ColorfulChat} />;
      default:
        return null;
    }
  }

  return (
    <div className=" flex flex-col justify-center items-center overflow-hidden relative">
      <div className="flex flex-col justify-center items-center gap-10 absolute ">
        <span>站式企业级大模型平台，提供先进的生成式AI生产及应用全流程开发</span>
        <span className="text-4xl">联通智能大模型平台</span>
        <span>个人和企业客户可通过联通智能大模型平台接入使用</span>
      </div>
      <div>
        <video src="/image.mp4" poster="/poster.jpeg" muted={true} autoPlay={true} loop={true}></video>
      </div>
    </div>
  );
};

export default Home;
