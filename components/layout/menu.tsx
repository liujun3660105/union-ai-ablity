import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps, MenuTheme } from 'antd';
import { Menu, Switch } from 'antd';
import { TFunction } from 'i18next';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key?: React.Key | null, icon?: React.ReactNode, children?: MenuItem[], type?: 'group'): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

// MenuItem[]
export const getItems: (t: TFunction<'translation', undefined>) => MenuItem[] = (t) => {
  return [
    getItem(t('Text_LLM'), 'text-llm', <MailOutlined />, [
      getItem(t('Intelligent_QA'), 'qa', <MailOutlined />),
      getItem(t('Text_Summarization'), 'ts', <MailOutlined />),
      getItem(t('Emotion_Classification'), 'ec', <MailOutlined />),
    ]),
    getItem(t('Image_LLM'), 'img-llm', <AppstoreOutlined />, [
      getItem(t('Image_QA'), 'iq', <MailOutlined />),
      getItem(t('Image_Generation'), 'ig', <MailOutlined />),
      getItem(t('Similar_Search'), 'ss', <MailOutlined />),
      getItem(t('Feature_Extraction'), 'fe', <MailOutlined />),
      getItem(t('Object_Recognition'), 'or', <MailOutlined />),
    ]),
    getItem(t('Agent'), 'agent', <AppstoreOutlined />, [
      getItem(t('MapAgent'), 'map-agent', <MailOutlined />),
      getItem(t('DocsAgent'), 'docs-agent', <MailOutlined />),
      getItem(t('BidingAgent'), 'biding-agent', <MailOutlined />),
    ]),

    getItem(t('Video_LLM'), 'video-llm', <SettingOutlined />, [getItem(t('Video_Generation'), 'vg')]),
  ];
};
