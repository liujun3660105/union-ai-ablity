import React, { useEffect, useState } from 'react';
import usePdf from '@/hooks/use-pdf';
import Image from 'next/image';
import psfViewerClass from './index.module.css';

import * as pdf from 'pdfjs-dist';
//@ts-ignore
import PDFWorker from 'pdfjs-dist/build/pdf.worker.mjs';
import 'pdfjs-dist/web/pdf_viewer.css';
import { PDFDocumentProxy } from 'pdfjs-dist';

pdf.GlobalWorkerOptions.workerSrc = PDFWorker;

interface PDFViewerProps {
  scale?: number;
  url?: string;
}

export default function Index(props: PDFViewerProps) {
  const { url, scale = 1.0 } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(0);
  async function initDocument(url: string) {
    setLoading(true);
    const pdfDocument = await pdf.getDocument(url).promise;
    setPageCount(pdfDocument.numPages);
    setTimeout(async () => {
      await renderPage(pdfDocument, pdfDocument.numPages);
    }, 0);

    // const taskList = new Array(pdfDocument.numPages).fill(null);
    // setTimeout(async () => {
    //   await Promise.all(
    //     taskList.map(async (_, i) => {
    //       const page = await pdfDocument.getPage(i + 1);
    //       const viewport = page.getViewport({ scale: 2.0 });

    //       // Prepare canvas using PDF page dimensions
    //       // const canvas = document.createElement('canvas');
    //       const canvas = document.getElementById(`pdf-viewer-canvas-${i + 1}`) as HTMLCanvasElement;
    //       const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    //       canvas.height = viewport.height;
    //       canvas.width = viewport.width;

    //       // Render PDF page into canvas context
    //       const renderContext = {
    //         canvasContext: context,
    //         viewport: viewport,
    //       };
    //       const renderTask = page.render(renderContext);
    //       await renderTask.promise;
    //       const url = canvas.toDataURL();
    //     }),
    //   );
    // }, 0);

    setLoading(false);
  }

  async function renderPage(pdf: PDFDocumentProxy, count: number, num = 1) {
    //渲染pdf页
    console.log('渲染pdf页');
    const page = await pdf.getPage(num);
    const canvas = document.getElementById(`pdf-viewer-canvas-${num}`) as HTMLCanvasElement;
    console.log('🚀 ~ renderPage ~ canvas:', canvas);

    if (!canvas) return;
    // const canvas = document.getElementById("the_canvas");
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const dpr = window.devicePixelRatio || 1;
    const bsr =
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio ||
      1;
    const ratio = dpr / bsr;
    const viewport = page.getViewport({ scale: 1 });
    canvas.width = viewport.width * ratio;
    canvas.height = viewport.height * ratio;
    canvas.style.width = viewport.width + 'px';
    // this.pdf_div_width = viewport.width + "px";
    canvas.style.height = viewport.height + 'px';
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    page.render(renderContext);
    if (count > num) {
      setTimeout(() => {
        return renderPage(pdf, count, num + 1);
      });
    }
  }

  useEffect(() => {
    if (!url) return;
    initDocument(url);
  }, [url]);
  //   const { loading, urlList } = usePdf(url, scale);
  const goPage = (page: number) => {
    document.querySelector(`pdf-viewer-img-${page}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      {new Array(pageCount).fill(null).map((_, i) => {
        return <canvas key={i} id={`pdf-viewer-canvas-${i + 1}`} />;
      })}
    </div>
  );
}
