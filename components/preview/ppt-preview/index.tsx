import React, { useEffect } from 'react';
import { FilePreviewOptions } from '../type';
import renderPptx from './renderPpt';

export default function Index(props: FilePreviewOptions) {
  const { url } = props;
  useEffect(() => {
    fetch(url, {
      method: 'GET',
      headers: {
        responseType: 'blob',
      },
    })
      .then((res) => res.blob())
      .then((data) => {
        renderPptx(data, 'ppt-container', null);
      });
  }, [url]);

  return <div id="ppt-container"></div>;
}
