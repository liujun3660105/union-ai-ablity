import React, { useEffect } from 'react';
import SplitPane from 'react-split-pane';
import UpLoadFile from '@/components/upload/UploadFile';
import PDFViewer from '@/components/pdfViewer';
import { wss } from '@/utils/ws';
import { Button } from 'antd';

export type FileType = 'Tendering' | 'Biding';

export default function Index() {
  function onReceiveMsg(res) {
    console.log('test', res);
  }

  function onReceiveMsg1(res) {
    console.log('test1', res);
  }

  useEffect(() => {
    // wss.connect('ws://localhost:5002/ws');
    // wss.registerCallBack('test', onReceiveMsg);
    // wss.registerCallBack('test1', onReceiveMsg1);
  }, []);

  function sendMsMessage() {
    wss.send({ value: 'June', socketType: 'test' });
  }
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
          <Button onClick={sendMsMessage}>发送请求</Button>
        </SplitPane>
      </SplitPane>
    </div>
  );
}
