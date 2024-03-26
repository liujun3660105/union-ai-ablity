import React from 'react';
import SplitPane from 'react-split-pane';
import UpLoadFile from '@/components/upload/UploadFile';
import PDFViewer from '@/components/pdfViewer';
export type FileType = 'Tendering' | 'Biding';

export default function Index() {
  function onTenderingFileSelect() {}
  function onBidingFileSelect() {}

  return (
    <div className="h-[calc(100vh-6rem)]">
      <SplitPane split="vertical">
        <SplitPane minSize="10%" maxSize="500px" initialSize="20%">
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="h-1/2 p-4">
              <UpLoadFile fileType="Tendering" onSelect={onTenderingFileSelect} />
            </div>
            <div className="h-1/2 p-4 border-t-2">
              <UpLoadFile fileType="Biding" onSelect={onBidingFileSelect} />
            </div>
          </div>
        </SplitPane>
        <SplitPane minSize="20%" initialSize="40%">
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="h-1/2">
              <PDFViewer fileType="Tendering" scale={1} url="https://arxiv.org/pdf/2210.03629.pdf" />
            </div>
            <div className="h-1/2 border-t-2">
              <PDFViewer fileType="Biding" scale={1} url="https://arxiv.org/pdf/2210.03629.pdf" />
            </div>
          </div>
        </SplitPane>
        <SplitPane minSize="20%" initialSize="40%">
          <div>fff</div>
        </SplitPane>
      </SplitPane>
    </div>
  );
}
