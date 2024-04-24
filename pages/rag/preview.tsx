import React from 'react';
import { fileFormatList, FileFormat } from './config';
import { UploadFileProps } from './upload';

export default function Index(props: UploadFileProps) {
  const { name } = props;
  const format = name.split('.')[1];
  // 根据文件格式获取对应的预览组件
  const PreviewComponent = fileFormatList.find((item) => item.value === format)?.PreviewComponent;
  return <>{PreviewComponent ? <PreviewComponent {...props} /> : <></>}</>;
}
