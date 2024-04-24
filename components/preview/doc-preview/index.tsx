import React, { useEffect, useRef } from 'react';
import { defaultOptions, renderAsync } from 'docx-preview';
// import { FilePreviewOptions } from '../type';
import { UploadFileProps } from '@/pages/rag/upload';
import { readBuffer, readDataURL } from '@/utils/data-handle';

export default function Index(props: UploadFileProps) {
  const { url } = props;
  const previewContainerRef = useRef<HTMLDivElement>(null);
  async function render(file: File) {
    const docxOptions = Object.assign(defaultOptions, {
      debug: true,
      experimental: true,
    });
    const fileBuffer = await readBuffer(file);
    await renderAsync(fileBuffer, previewContainerRef.current!, undefined, docxOptions);
  }
  useEffect(() => {
    if (!url) return;
    fetch(url, {
      method: 'GET',
      headers: {
        responseType: 'blob',
      },
    })
      .then((res) => res.blob())
      .then((file) => {
        render(file);
      });
  }, [url]);
  return <div ref={previewContainerRef} className=" w-full h-full"></div>;
}
