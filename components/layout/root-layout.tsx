import React, { useContext, useEffect, useRef, useState } from 'react';
import { ChatContext } from '@/context/chat-context';
import { useTranslation } from 'react-i18next';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import ThemeColor from '@/styles/colors';
import SideBar from '@/components/layout/side-bar';
import classNames from 'classnames';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isMenuExpand, mode, setIsMenuExpand } = useContext(ChatContext);
  function handleResize() {
    if (document.body.clientWidth < 992) {
      setIsMenuExpand(false);
    }
    // else {
    //   setIsMenuExpand(true);
    // }
  }
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // const [primaryColor, setPrimaryColor] = useState<string>('#0069');

  const { i18n } = useTranslation();

  return (
    <ConfigProvider
      locale={i18n.language === 'en' ? enUS : zhCN}
      theme={{
        token: {
          colorPrimary: ThemeColor[mode]['base-200'],
          // colorBgContainer: ThemeColor[mode || 'light']['base-300'],
          colorBgBase: ThemeColor[mode]['base-300'],
          colorText: ThemeColor[mode]['base-content'],

          // colorInfoText: ThemeColor[mode || 'light']['base-content'],
          // colorPrimaryTextActive: ThemeColor[mode || 'light']['base-content'],
          // colorInfoTextActive: ThemeColor[mode || 'light']['base-content'],
          // colorBgTextActive: ThemeColor[mode || 'light']['base-content'],
          // colorPrimaryText: ThemeColor[mode || 'light']['base-content'],
          // colorTextBase: ThemeColor[mode || 'light']['base-content'],
          // colorTextSecondary: ThemeColor[mode || 'light']['base-content'],
          // colorPrimaryActive: ThemeColor[mode || 'light']['base-content'],
          // // colorBgTextHover: ThemeColor[mode || 'light']['base-content'],
          // colorHighlight: ThemeColor[mode || 'light']['base-content'],
          // colorInfoActive: ThemeColor[mode || 'light']['base-content'],
          // controlItemBgActiveHover: ThemeColor[mode || 'light']['base-content'],
          // controlItemBgActive: ThemeColor[mode || 'light']['base-300'],

          // colorBgBase: '#232734',
          // colorBorder: '#828282',
          // colorBgContainer: '#232734',
          // colorPrimaryActive: ThemeColor[mode || 'light']['primary'],
          // colorPrimaryBg: ThemeColor[mode || 'light']['primary'],
          // colorPrimaryBgHover: ThemeColor[mode || 'light']['primary'],

          // colorText: ['dark', 'magenta', 'purple', 'grey'].includes(mode) ? '#fff' : '#000',

          // colorPrimary: '#1677ff',
          // colorBgContainer: '#1677ff',
          // borderRadius: 4,
        },
        components: {
          Menu: {
            colorPrimary: ThemeColor[mode]['base-content'],
          },
          Button: {
            // colorPrimary: ThemeColor[mode]['base-content'],
            colorText: ThemeColor[mode]['base-content'],
            algorithm: true,
          },
          Tabs: {
            itemSelectedColor: ThemeColor[mode]['base-content'],
            itemHoverColor: ThemeColor[mode]['base-content'],
            algorithm: true,
          },
        },

        // algorithm: mode === 'dark' ? antdDarkTheme : undefined,
      }}
    >
      <div className="flex w-screen h-screen overflow-hidden">
        <div className={classNames('transition-[width]', isMenuExpand ? 'w-60' : 'w-20', 'bg-base-200')}>
          <SideBar />
        </div>
        <div className="flex flex-col flex-1 relative overflow-hidden">
          <div className="shadow border-b-2 h-24 text-center text-xl flex flex-none items-center justify-center">天津联通大模型基础平台</div>
          {children}
        </div>
      </div>
    </ConfigProvider>
  );
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
