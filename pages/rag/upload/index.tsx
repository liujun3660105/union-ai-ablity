'use client';
import { useState, useRef, useEffect } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { ragFileUpload, ragFileParser, updateFileParserStatus, getFileList } from '@/client/api';
import { FileFormat, fileFormatList } from '../config';
import FileItem from './custom-file-item';
import update from 'immutability-helper';

const { Dragger } = Upload;

const fileProps: UploadProps = {
  name: 'file',
  multiple: true,
  accept: fileFormatList.map((item) => item.label).join(','),
  // fileList: fileList,
  // action: 'http://localhost:3000/api/rag/upload',

  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
  beforeUpload(file: RcFile) {
    const isFileFormatValidate = fileFormatList.map((item) => item.type).includes(file.type);
    if (!isFileFormatValidate) {
      message.error(`The file ${file.name} you upload is not valid, only pdf、doc、ppt、excel、img、txt、markdown are supported`);
    }
    const isLt2M = file.size / 1024 / 1024 < 200;
    if (!isLt2M) {
      message.error(`The file ${file.name} must smaller than 2MB!`);
    }
    return isFileFormatValidate && isLt2M;
  },
  showUploadList: false,
};
export interface UploadFileProps extends UploadFile {
  fileParsing: Boolean;
}
interface IUploadFileProps {
  onSelect: (file: UploadFileProps) => void;
  fileformat: FileFormat[];
}

export default function UploadFile(props: IUploadFileProps) {
  const { onSelect } = props;
  const [fileList, setFileList] = useState<UploadFileProps[]>([]);
  const fileListRef = useRef<UploadFileProps[]>([]);

  function handlePreviewFile(f: UploadFileProps) {
    console.log('ffff', f);
    onSelect(f);
  }
  function handleDeleteFile(f: UploadFileProps) {
    console.log('delete', f);
  }
  useEffect(() => {
    fetchFileList();
  }, []);
  async function fetchFileList() {
    const fileList = await getFileList();
    console.log('🚀 ~ fetchFileList ~ fileList:', fileList);
    const originFileList = fileList.data.data;
    const processFileList = originFileList.map((f: any) => {
      return {
        uid: f.fileId,
        name: f.fileName,
        url: f.fileUrl,
        fileParsing: f.fileParsingStatus,
        percent: 100,
        status: 'done',
      };
    });
    setFileList(processFileList.reverse());
  }

  return (
    <div>
      <Dragger
        {...fileProps}
        fileList={fileList}
        onChange={(e) => {
          console.log('e.fileList', e.fileList);
          const newFileList: UploadFileProps[] = [...e.fileList].map((f) => ({ ...f, fileParsing: false }));
          const diffFileList = newFileList.filter((f) => !fileListRef.current.find((ff) => ff.uid === f.uid)).reverse();
          fileListRef.current = [...diffFileList, ...fileListRef.current];
          setFileList(fileListRef.current);
        }}
        customRequest={(options) => {
          const file = options.file as RcFile;
          const fileId = file.uid;
          const fileName = file.name;

          const fileForamtItem = fileFormatList.find((item) => item.type === file.type);
          const fileItemIndex = fileList.findIndex((item) => item.uid === file.uid);
          const formData = new FormData();
          formData.append('file', file);
          formData.append('fileId', fileId);
          formData.append('fileFormat', fileForamtItem?.value || FileFormat.PDF);
          const fileFormat = fileForamtItem?.value || FileFormat.PDF;
          ragFileUpload({
            data: formData,
            // options.onProgress
            onUploadProgress: (e) => {
              const percent = Number((e.progress * 100).toFixed(2));
              const newFileList = update(fileListRef.current, {
                [fileItemIndex]: {
                  $merge: { percent: Number((e.progress * 100).toFixed(2)), status: 'uploading' },
                },
              });
              fileListRef.current = newFileList;
              setFileList(newFileList);
            },
          })
            .then(async (res) => {
              const fileUrl = res.data.url as string;
              const newFileList = update(fileListRef.current, {
                [fileItemIndex]: {
                  $merge: { url: fileUrl, status: 'done' },
                },
              });
              setFileList(newFileList);
              fileListRef.current = newFileList;
              void message.success(`${fileName}上传成功`);
              // 文件传到后天进行解析
              try {
                // const fileParserForm
                console.log(fileId, fileName);
                const isSuccess = await ragFileParser({
                  file_id: fileId,
                  file_name: fileName,
                  file_path: fileUrl,
                  file_format: fileFormat,
                });
                const newFileList = update(fileListRef.current, {
                  [fileItemIndex]: {
                    $merge: { fileParsing: true },
                  },
                });
                setFileList(newFileList);
                fileListRef.current = newFileList;

                await updateFileParserStatus({ fileId, status: true });
                void message.success(`${fileName}解析成功`);
              } catch (error) {
                void message.error(`${fileName}解析失败`);
              }
            })
            .catch((e) => {
              const newFileList = update(fileList, {
                [fileItemIndex]: {
                  $merge: { status: 'error' },
                },
              });
              setFileList(newFileList);
              void message.error(`${fileName}上传失败`);
            });
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或者拖拽文件到这个区域进行上传</p>
      </Dragger>
      <div className="flex flex-col space-y-5 py-2 ">
        {fileList.map((f) => {
          return <FileItem key={f.uid} onClick={handlePreviewFile} f={f} handleDelete={handleDeleteFile} />;
        })}
      </div>
    </div>
  );
}
