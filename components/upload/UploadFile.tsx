'use client';
import { useEffect, useState, useMemo } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { Progress } from 'antd';
import { DeleteOutlined as Trash } from '@ant-design/icons';
import { FileType } from '@/pages/agent/biding-agent';
import { bidingFileLoad } from '@/client/api';
import { uniqueId } from 'lodash';

const { Dragger } = Upload;

export interface UploadFileProps {
  // vectorStoreCollection: string;
  id: string;
  fileName: string;
  fileUrl: string;
  vectorStoreCollection?: string;
  progress: number;
  type: FileType;
}
interface IUploadFileProps {
  onSelect: (file: UploadFileProps) => void;
  fileType: FileType;
}

export default function UploadFile(props: IUploadFileProps) {
  const { onSelect, fileType } = props;
  const fileProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.pdf',
    // action: "/api/chatDoc",
    // onChange({ fileList, file }) {
    // console.log(
    //   "🚀 ~ file: Upload.tsx:23 ~ onChange ~ fileList:",
    //   fileList,
    //   file,
    // );

    // const { status } = file;
    // if (status !== "uploading") {
    //   console.log(file, fileList);
    // }
    // if (status === "done") {
    //   void message.success(`${file.name} file uploaded successfully.`);
    // } else if (status === "error") {
    //   void message.error(`${file.name} file upload failed.`);
    // }
    // if (status === "done") {
    //   console.log("file done");
    //   void fileQuery.refetch();
    // const newFileList = fileList.slice().push({...file,status:'done',vectorStoreCollection:'xxx'})
    // setFileList(newFileList);
    //   }
    // },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    beforeUpload(file: RcFile) {
      const isPDF = file.type === 'application/pdf';
      if (!isPDF) {
        void message.error('You can only upload JPG/PNG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 200;
      if (!isLt2M) {
        void message.error('Image must smaller than 2MB!');
      }
      return isPDF && isLt2M;
    },
    showUploadList: false,
    customRequest: (options) => {
      setUploadingFile({
        id: Math.random().toString(),
        fileName: options.filename ?? '',
        fileUrl: '',
        progress: 0.1,
        type: fileType,
      });
      const formData = new FormData();
      formData.append('file', options.file);
      formData.append('fileType', fileType);
      bidingFileLoad({
        data: formData,
        onUploadProgress: (e) => {
          setUploadingFile({
            id: Math.random().toString(),
            fileName: options.filename ?? '',
            fileUrl: '',
            progress: Math.round((e.progress ?? 0) * 100 - 1),
            type: fileType,
          });
        },
      })
        .then((res) => {
          const file = options.file as RcFile;
          //   void fileQuery.refetch();
          const fileUrl = URL.createObjectURL(file);
          const fileName = file.name;
          const fileId = uniqueId();
          const newFile: UploadFileProps = {
            id: fileId,
            fileName,
            fileUrl,
            progress: 100,
            type: fileType,
          };
          if (fileType === 'Tendering') {
            setFileList([newFile]);
          } else {
            const newFileList = fileList.slice();
            newFileList.push(newFile);
            setFileList(newFileList);
          }
          setUploadingFile(undefined);
          void message.success(`${options.filename}上传成功`);
        })
        .catch((e) => {
          setUploadingFile(undefined);
          void message.error(`${options.filename}上传失败`);
        });
    },
    // listType: "text",
  };
  const [fileList, setFileList] = useState<UploadFileProps[]>([]);
  const [upLoadingFile, setUploadingFile] = useState<UploadFileProps>();

  function handleUploadFile(f: UploadFileProps) {
    console.log('ffff', f);
    onSelect(f);
  }
  function handleDeleteFile(f: UploadFileProps) {
    console.log('delete', f);
  }

  return (
    <div>
      <h2>请上传{fileType === 'Biding' ? '投标文件' : '招标文件'}</h2>
      <Dragger {...fileProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或者拖拽文件到这个区域进行上传</p>
        <p className="ant-upload-hint">目前仅支持PDF文件</p>
      </Dragger>
      <div className="flex flex-col space-y-5 py-2 ">
        {upLoadingFile?.progress && upLoadingFile?.progress > 0 && (
          <FileItem onClick={handleUploadFile} f={upLoadingFile} handleDelete={handleDeleteFile} />
        )}
        {/* <div className=" my-2 bg-primary/5" onClick={()=>{handleUploadFile(f)}}>{f.name}</div>
         */}
        {/* <FileItem onClick={handleUploadFile} f={f} /> */}
        {fileList.map((f) => {
          return <FileItem key={f.id} onClick={handleUploadFile} f={f} handleDelete={handleDeleteFile} />;
        })}
      </div>
    </div>
  );
}

interface FileItemProps {
  onClick: (f: UploadFileProps) => void;
  handleDelete: (f: UploadFileProps) => void;
  f?: UploadFileProps;
}

const FileItem = (props: FileItemProps) => {
  const { onClick, f, handleDelete } = props;
  return (
    <div className="bg-primary/5 hover:bg-primary/20 px-3">
      <div
        className="my-2 flex h-10  cursor-pointer  items-center justify-between  transition"
        onClick={() => {
          f && onClick(f);
        }}
      >
        <span>{f?.fileName ?? ''}</span>
        {f?.progress && (
          <Trash
            className=" h-4 w-4"
            onClick={(e) => {
              f && handleDelete(f);
            }}
          />
        )}
      </div>
      <Progress percent={f?.progress ?? 0} size="small" />
    </div>
  );
};
