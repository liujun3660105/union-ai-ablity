import PDFViewer from '@/components/preview/pdfViewer/pdf-canvas-viewer';
// import PDFViewer from '@/components/preview/pdfViewer/pdf-new-viewer';
import DOCViewer from '@/components/preview/doc-preview';
import TXTViewer from '@/components/preview/txt-preview';
import PPTViewer from '@/components/preview/ppt-preview';
import EXCELViewer from '@/components/preview/excel-preview';
import ImageViewer from '@/components/preview/image-preview';
import MarkdownViewer from '@/components/preview/markdown-preview';
import React from 'react';

interface FileFormatItem {
  value: FileFormat;
  label: string;
  type: string;
  PreviewComponent: (props: any) => React.JSX.Element; // 预览组件
}

export enum FileFormat {
  PDF = 'pdf',
  DOC = 'docx',
  TXT = 'txt',
  PPT = 'pptx',
  EXCEL = 'xlsx',
  IMAGE = 'jpg',
  MARKDOWN = 'md',
}

export const fileFormatList: FileFormatItem[] = [
  {
    value: FileFormat.PDF,
    label: '.pdf',
    type: 'application/pdf',
    // PreviewComponent: React.lazy((props) => import('@/components/preview/pdfViewer/pdf-new-viewer')),
    PreviewComponent: PDFViewer,
  },
  {
    value: FileFormat.DOC,
    label: '.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    PreviewComponent: DOCViewer,
  },
  {
    value: FileFormat.EXCEL,
    label: '.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    PreviewComponent: EXCELViewer,
  },
  {
    value: FileFormat.PPT,
    label: '.pptx',
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    PreviewComponent: PPTViewer,
  },
  {
    value: FileFormat.TXT,
    label: '.txt',
    type: 'text/plain',
    PreviewComponent: TXTViewer,
  },
  {
    value: FileFormat.IMAGE,
    label: '.jpg',
    type: 'text/plain',
    PreviewComponent: ImageViewer,
  },
  {
    value: FileFormat.MARKDOWN,
    label: '.md',
    type: 'text/markdown',
    PreviewComponent: MarkdownViewer,
  },
];
