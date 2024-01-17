import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps, MenuTheme } from 'antd';
import { Menu, Switch } from 'antd';
import { TFunction } from 'i18next';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  routePath?: string,
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    routePath,
  } as MenuItem;
}

// MenuItem[]
export const getItems: (t: TFunction<'translation', undefined>) => MenuItem[] = (t) => {
  return [
    getItem(t('Text_LLM'), 'sub1', <MailOutlined />, [
      getItem(t('Intelligent_QA'), '1', <MailOutlined />, undefined, '/text-llm/qa'),
      getItem(t('Text_Summarization'), '2', <MailOutlined />),
      getItem(t('Emotion_Classification'), '3', <MailOutlined />),
    ]),
    getItem(t('Image_LLM'), 'sub2', <AppstoreOutlined />, [
      getItem(t('Image_Generation'), '5', <MailOutlined />),
      getItem(t('Similar_Search'), '5', <MailOutlined />),
      getItem(t('Feature_Extraction'), '6', <MailOutlined />),
      getItem(t('Object_Recognition'), '6', <MailOutlined />),
    ]),

    getItem(t('Video_LLM'), 'sub4', <SettingOutlined />, [getItem(t('Video_Generation'), '9')]),
  ];
};
