import { createContext, useEffect, useMemo, useState } from 'react';
import { apiInterceptors, getDialogueList, getUsableModels } from '@/client/api';
import { useRequest } from 'ahooks';
import { ChatHistoryResponse, DialogueListResponse, IChatDialogueSchema } from '@/types/chat';
import { useSearchParams } from 'next/navigation';
import { STORAGE_THEME_KEY } from '@/utils';
import { Theme } from 'daisyui/src';

// type ThemeMode = 'dark' | 'light';

interface IChatContext {
  mode: Theme;
  isContract?: boolean;
  isMenuExpand?: boolean;
  scene: IChatDialogueSchema['chat_mode'] | (string & {});
  chatId: string;
  model: string;
  dbParam?: string;
  modelList: Array<string>;
  agentList: string[];
  dialogueList?: DialogueListResponse;
  setMode: (mode: Theme) => void;
  setAgentList?: (val: string[]) => void;
  setModel: (val: string) => void;
  setIsContract: (val: boolean) => void;
  setIsMenuExpand: (val: boolean) => void;
  setDbParam: (val: string) => void;
  queryDialogueList: () => void;
  refreshDialogList: () => void;
  currentDialogue?: DialogueListResponse[0];
  history: ChatHistoryResponse;
  setHistory: (val: ChatHistoryResponse) => void;
  docId?: number;
  setDocId: (docId: number) => void;
}

function getDefaultTheme(): Theme {
  const theme = localStorage.getItem(STORAGE_THEME_KEY) as Theme;
  if (theme) return theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const ChatContext = createContext<IChatContext>({
  mode: 'light',
  scene: '',
  chatId: '',
  modelList: [],
  model: '',
  dbParam: undefined,
  dialogueList: [],
  agentList: [],
  setAgentList: () => {},
  setModel: () => {},
  setIsContract: () => {},
  setIsMenuExpand: () => {},
  setDbParam: () => void 0,
  queryDialogueList: () => {},
  refreshDialogList: () => {},
  setMode: () => void 0,
  history: [],
  setHistory: () => {},
  docId: undefined,
  setDocId: () => {},
});

const ChatContextProvider = ({ children }: { children: React.ReactElement }) => {
  const searchParams = useSearchParams();
  const chatId = searchParams?.get('id') ?? '';
  const scene = searchParams?.get('scene') ?? '';
  const db_param = searchParams?.get('db_param') ?? '';

  const [isContract, setIsContract] = useState(false);
  const [model, setModel] = useState<string>('');
  const [isMenuExpand, setIsMenuExpand] = useState<boolean>(scene !== 'chat_dashboard');
  const [dbParam, setDbParam] = useState<string>(db_param);
  const [agentList, setAgentList] = useState<string[]>([]);
  const [history, setHistory] = useState<ChatHistoryResponse>([]);
  const [docId, setDocId] = useState<number>();
  const [mode, setTheme] = useState<Theme>('light');
  const setMode = (theme: Theme) => {
    setTheme(theme);
    document.documentElement.setAttribute(`data-theme`, theme);
    localStorage.setItem(STORAGE_THEME_KEY, theme);
  };

  const {
    run: queryDialogueList,
    data: dialogueList = [],
    refresh: refreshDialogList,
  } = useRequest(
    async () => {
      const [, res] = await apiInterceptors(getDialogueList());
      return res ?? [];
    },
    {
      manual: true,
    },
  );

  const { data: modelList = [] } = useRequest(
    async () => {
      const [, res] = await apiInterceptors(getUsableModels());
      return res ?? [];
    },
    {
      manual: true,
    },
  );

  useEffect(() => {
    setMode(getDefaultTheme());
  }, []);

  //这里是从接口里获取mode
  // useEffect(() => {
  //   setModel(modelList[0]);
  // }, [modelList, modelList?.length]);

  const currentDialogue = useMemo(() => dialogueList.find((item: any) => item.conv_uid === chatId), [chatId, dialogueList]);
  const contextValue = {
    isContract,
    isMenuExpand,
    scene,
    chatId,
    modelList,
    model,
    dbParam: dbParam || db_param,
    dialogueList,
    agentList,
    mode,
    setMode,
    setAgentList,
    setModel,
    setIsContract,
    setIsMenuExpand,
    setDbParam,
    queryDialogueList,
    refreshDialogList,
    currentDialogue,
    history,
    setHistory,
    docId,
    setDocId,
  };
  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

export { ChatContext, ChatContextProvider };
