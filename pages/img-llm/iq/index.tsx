'use client';
import React, { useEffect, useState } from 'react';
//@ts-ignore
import SplitPane, { Pane } from 'react-split-pane-next';
import { Upload, Image, Button } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
// import UpLoadFile, { UploadFileProps } from './upload';
// import { FileFormat } from './config';
// import PDFViewer from '@/components/preview/pdfViewer';
// import Preview from './preview';
// import { fileFormatList } from './config';
import { LayoutWrapper as Layout } from '@/components/layout/root-layout';
import type { ReactElement } from 'react';
import ChatClient from '@/components/chat/chat-client';

// type FileType = Parameters<<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function Index() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-2',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-3',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-4',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-xxx',
      percent: 50,
      name: 'image.png',
      status: 'uploading',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-5',
      name: 'image.png',
      status: 'error',
    },
  ]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as any);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList);
  // const [fileObj, setFileObj] = useState<UploadFileProps>();
  // const [fileUrl, setFileUrl] = useState<string>();
  // const [fileFormat, setFileFormat] = useState<FileFormat>();
  function onFileSelect(file) {
    // setFileObj(file);
    // setFileUrl(file.fileUrl);
    // setFileFormat(file.format);
  }

  return (
    <div className="h-[calc(100vh-6rem)]">
      <SplitPane split="vertical">
        <Pane minSize="10%" maxSize="500px" initialSize="20%" className="border-r-2">
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="p-4">
              {/* <UpLoadFile fileformat={[FileFormat,]} onSelect={onFileSelect} /> */}
              <Upload
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                <Button>上传</Button>
              </Upload>
              {previewImage && (
                <Image
                  alt="preview"
                  wrapperStyle={{ display: 'none' }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                  }}
                  src={previewImage}
                />
              )}
            </div>
          </div>
        </Pane>
        {/* <Pane minSize="20%" initialSize="40%" className="border-r-2">
          <div className="flex flex-col h-full overflow-y-auto">{fileObj && <Preview {...fileObj} />}</div>
        </Pane> */}
        <Pane minSize="20%" initialSize="80%">
          <ChatClient
            callback={() => {}}
            clientId="12345"
            queryAgentURL="/api/v1/vl/chat"
            initAIContent="你好，图片问答助手，有什么问题可以帮助你吗"
            image="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          />
        </Pane>
      </SplitPane>
    </div>
  );
}
Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
