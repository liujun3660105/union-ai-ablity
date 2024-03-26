import React, { useEffect } from 'react';
import usePdf from '@/hooks/use-pdf';
import Image from 'next/image';
import psfViewerClass from './index.module.css';
import { FileType } from '@/pages/agent/biding-agent';

interface PDFViewerProps {
  scale?: number;
  url: string;
  fileType: FileType;
}

export default function Index(props: PDFViewerProps) {
  const { url, scale = 1.0, fileType } = props;
  const { loading, urlList } = usePdf(url, scale);
  const goPage = (page: number) => {
    document.querySelector(`pdf-viewer-img-${page}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      {loading ? (
        <>loading...</>
      ) : (
        urlList.map((url, i) => (
          <img
            id={`${fileType}-pdf-viewer-img-${i + 1}`}
            className={psfViewerClass.unselectable}
            draggable="false"
            key={i}
            src={url}
            alt=""
            width="100%"
          />
        ))
      )}
    </div>
  );
}
