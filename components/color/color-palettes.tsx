import React, { useCallback, useContext, useMemo } from 'react';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space } from 'antd';
import { ChatContext } from '@/app/chat-context';
// import ThemeColor, { ThemeMode } from '@/styles/colors';
import { useTranslation } from 'react-i18next';
import { StarsSvg } from '@/components/icons';
import daisyuiColors from 'daisyui/src/theming/themes';
import { Theme } from 'daisyui/src/index';
import useThemeColor from '@/hooks/use-theme';
import ThemeColor from '@/styles/colors';
import { CheckOutlined } from '@ant-design/icons';

export default function ColorPalettes() {
  const { mode, setMode } = useContext(ChatContext);
  const { t, i18n } = useTranslation();
  const themeColor = useThemeColor(mode);

  const items = useCallback(() => {
    const dropdownRender = (
      <div className="max-h-36 overflow-auto border-2 py-2 px-3 bg-base-100">
        {(Object.keys(ThemeColor) as (keyof typeof ThemeColor)[]).map((k: Theme) => {
          return (
            <div
              className="h-10 w-25 cursor-pointer rounded-md mb-2 flex items-center justify-center"
              key={k}
              onClick={() => {
                setMode(k);
              }}
              style={{ backgroundColor: ThemeColor[k]['base-200'], color: ThemeColor[k]['base-content'] }}
            >
              {mode === k && <CheckOutlined />}
              {k}
            </div>
          );
        })}
      </div>
    );

    return dropdownRender;
  }, [i18n.language, mode]);

  return (
    <Dropdown placement="topLeft" dropdownRender={items}>
      <div className="">
        <StarsSvg />
      </div>
    </Dropdown>
  );
}
