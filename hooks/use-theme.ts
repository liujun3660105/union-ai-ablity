import { useCallback, useEffect, useMemo, useState } from 'react';
// import useSWR from 'ahooks/lib/useS';

export default function useThemeColor(mode: string) {
  const [themeColorObj, setThemeColorObj] = useState<{ [key: string]: string }>();
  useEffect(() => {
    if (window) {
      const getPropertyValue = (name: string) => window.getComputedStyle(document.body).getPropertyValue(name);
      const primary = getPropertyValue('--p');
      const primaryContent = getPropertyValue('--pc');
      const secondary = getPropertyValue('--s');
      const secondaryContent = getPropertyValue('--sc');
      const baseContent = getPropertyValue('---bc'); // 文字
      const base_100 = getPropertyValue('---bc');
      const base_200 = getPropertyValue('---bc');
      const base_300 = getPropertyValue('---bc');
      setThemeColorObj({ primary, primaryContent, secondary, secondaryContent, baseContent, base_100, base_200, base_300 });
    }
  }, [mode]);
  function getPropertyValue(name: string) {
    return window.getComputedStyle(document.body).getPropertyValue(name);
  }
  //   const themeColor = useMemo(() => {
  //     const primary = getPropertyValue('--p');
  //     const primaryContent = getPropertyValue('--pc');
  //     const secondary = getPropertyValue('--s');
  //     const secondaryContent = getPropertyValue('--sc');
  //     const baseContent = getPropertyValue('---bc'); // 文字
  //     const base_100 = getPropertyValue('---bc');
  //     const base_200 = getPropertyValue('---bc');
  //     const base_300 = getPropertyValue('---bc');

  //     // const secondaryText = getPropertyValue('--sc');
  //     return { primary, primaryContent, secondary, secondaryContent, baseContent, base_100, base_200, base_300 };
  //   }, [mode]);

  // The key "data:theme" could be anything, as long as it's unique in the app
  // const { data: color, mutate } = useSWR("data:theme", themeFetcher);

  // return { ...color, mutate };
  return themeColorObj;
}
