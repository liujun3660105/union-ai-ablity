import React, { useEffect } from 'react';
import { UploadFileProps } from '@/pages/rag/upload';
import { readText, readFileFromUrl } from '@/utils/data-handle';
import { useState } from 'react';

export default function Index(props: UploadFileProps) {
  const [text, setText] = useState<string>('');
  const { url } = props;
  useEffect(() => {
    getText(url);
  }, [url]);
  async function getText(url: string) {
    const file = await readFileFromUrl(url);
    const txt = (await readText(file)) as string;
    setText(txt);
  }
  return <div>{text}</div>;
}
