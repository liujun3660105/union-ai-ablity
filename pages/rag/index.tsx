'use client';
import React, { useEffect, useState } from 'react';
//@ts-ignore
import SplitPane, { Pane } from 'react-split-pane-next';
import UpLoadFile, { UploadFileProps } from './upload';
import { FileFormat } from './config';
// import PDFViewer from '@/components/preview/pdfViewer';
import Preview from './preview';
import { fileFormatList } from './config';
import { LayoutWrapper as Layout } from '@/components/layout/root-layout';
import type { ReactElement } from 'react';
import { Button } from 'antd';
import { bidingQA } from '@/client/api';
import ChatClient from '@/components/chat/chat-client';
import PDFViewer from '@/components/preview/pdfViewer/pdf-canvas-viewer';

export default function Index() {
  const [fileObj, setFileObj] = useState<UploadFileProps>();
  // const [fileUrl, setFileUrl] = useState<string>();
  // const [fileFormat, setFileFormat] = useState<FileFormat>();
  function onFileSelect(file: UploadFileProps) {
    setFileObj(file);
    // setFileUrl(file.fileUrl);
    // setFileFormat(file.format);
  }

  return (
    <div className="h-[calc(100vh-6rem)]">
      <SplitPane split="vertical">
        <Pane minSize="10%" maxSize="500px" initialSize="20%" className="border-r-2">
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="p-4">
              <UpLoadFile
                fileformat={[FileFormat.PDF, FileFormat.DOC, FileFormat.EXCEL, FileFormat.PPT, FileFormat.TXT, FileFormat.MARKDOWN]}
                onSelect={onFileSelect}
              />
            </div>
          </div>
        </Pane>
        <Pane minSize="20%" initialSize="40%" className="border-r-2">
          <div className="flex flex-col h-full overflow-y-auto">{fileObj && <Preview {...fileObj} />}</div>
        </Pane>
        <Pane minSize="20%" initialSize="40%">
          <ChatClient
            callback={() => {}}
            clientId="12345"
            queryAgentURL="/api/v1/rag/chat"
            initAIContent="你好，我是文件小助手，有什么问题可以帮助你吗"
          />
        </Pane>
      </SplitPane>
    </div>
  );
}
Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
