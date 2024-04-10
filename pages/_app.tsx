import type { AppProps } from 'next/app';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { CssVarsProvider, ThemeProvider, useColorScheme } from '@mui/joy/styles';
import { joyTheme } from '@/defaultTheme';
import TopProgressBar from '@/components/layout/top-progress-bar';
import { useTranslation } from 'react-i18next';
import { ChatContext, ChatContextProvider } from '@/context/chat-context';
import '../styles/globals.css';
import '../nprogress.css';
import '../context/i18n';
import { STORAGE_LANG_KEY, STORAGE_THEME_KEY } from '@/utils';
import { MappingAlgorithm, theme } from 'antd';
import { NextPageWithLayout } from '@/components/layout/root-layout';
// import SessionProvider from '@/components/session-provider';
import { SessionProvider } from 'next-auth/react';

type ThemeMode = ReturnType<typeof useColorScheme>['mode'];

const antdDarkTheme: MappingAlgorithm = (seedToken, mapToken) => {
  return {
    ...theme.darkAlgorithm(seedToken, mapToken),
    colorBgBase: '#232734',
    colorBorder: '#828282',
    colorBgContainer: '#232734',
  };
};

function CssWrapper({ children }: { children: React.ReactElement }) {
  const { mode } = useContext(ChatContext);
  const { i18n } = useTranslation();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref?.current && mode) {
      // ref?.current?.classList?.add(mode);
      // if (mode === 'light') {
      //   ref?.current?.classList?.remove('dark');
      // } else {
      //   ref?.current?.classList?.remove('light');
      // }
    }
  }, [ref, mode]);

  useEffect(() => {
    i18n.changeLanguage && i18n.changeLanguage(window.localStorage.getItem(STORAGE_LANG_KEY) || 'en');
  }, [i18n]);

  return (
    <div ref={ref}>
      <TopProgressBar />
      {children}
    </div>
  );
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <ChatContextProvider>
      <CssWrapper>
        {/* <LayoutWrapper> */}

        <SessionProvider session={session}>{getLayout(<Component {...pageProps} />)}</SessionProvider>
        {/* </LayoutWrapper> */}
      </CssWrapper>
    </ChatContextProvider>
  );
}

export default MyApp;
