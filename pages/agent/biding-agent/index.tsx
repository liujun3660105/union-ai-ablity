'use client';
import React, { useEffect, useState } from 'react';
//@ts-ignore
import SplitPane, { Pane } from 'react-split-pane-next';
import UpLoadFile, { UploadFileProps } from '@/components/upload/UploadFile';
import PDFViewer from '@/components/preview/pdfViewer';
import { LayoutWrapper as Layout } from '@/components/layout/root-layout';
import type { ReactElement } from 'react';
import { Button } from 'antd';
import { bidingQA } from '@/client/api';

// export type FileType = 'tendering' | 'biding';
export enum FileType {
  TENDERING = 'tendering',
  BIDING = 'biding',
}

export default function Index() {
  const [bidingFileUrl, setBidingFileUrl] = useState<string>();
  const [tenderingFileUrl, setTenderingFileUrl] = useState<string>();
  useEffect(() => {}, []);

  function onTenderingFileSelect(file: UploadFileProps) {
    setTenderingFileUrl(file.fileUrl);
  }
  function onBidingFileSelect(file: UploadFileProps) {
    setBidingFileUrl(file.fileUrl);
  }

  return (
    <div className="h-[calc(100vh-6rem)]">
      {/* <SplitPane split="vertical" minSize={50}>
        <div />
        <SplitPane split="horizontal">
          <div />
          <div />
        </SplitPane>
      </SplitPane> */}
      <SplitPane split="vertical">
        <Pane minSize="10%" maxSize="500px" initialSize="20%" className="border-r-2">
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="h-1/2 p-4">
              <UpLoadFile fileType={FileType.TENDERING} onSelect={onTenderingFileSelect} />
            </div>
            <div className="h-1/2 p-4 border-t-2">
              <UpLoadFile fileType={FileType.BIDING} onSelect={onBidingFileSelect} />
            </div>
          </div>
        </Pane>
        <Pane minSize="20%" initialSize="40%" className="border-r-2">
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="h-1/2">
              <PDFViewer scale={1} url={tenderingFileUrl} />
            </div>
            <div className="h-1/2 border-t-2 relative">
              {/* "https://arxiv.org/pdf/2210.03629.pdf" */}
              <PDFViewer scale={1} url={bidingFileUrl} />
            </div>
          </div>
        </Pane>
        <Pane minSize="20%" initialSize="40%">
          <div>
            <Button
              onClick={async () => {
                await bidingQA({ query: '尿酸多高', file_id: '123' });
              }}
            >
              问答测试
            </Button>
          </div>
        </Pane>
      </SplitPane>
    </div>
  );
}
Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
