import React, { useEffect, useRef, useState } from 'react';
import * as pdf from 'pdfjs-dist';
//@ts-ignore
import PDFWorker from 'pdfjs-dist/build/pdf.worker.mjs';
import { TextLayerBuilder } from 'pdfjs-dist/web/pdf_viewer.mjs';
import 'pdfjs-dist/web/pdf_viewer.css';

pdf.GlobalWorkerOptions.workerSrc = PDFWorker;

export default function usePdf(url: string, scale: number = 1.0) {
  const urlList = useRef<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function initDocument(url: string) {
    setLoading(true);
    const pdfDocument = await pdf.getDocument(url).promise;
    const taskList = new Array(pdfDocument.numPages).fill(null);
    await Promise.all(
      taskList.map(async (_, i) => {
        const page = await pdfDocument.getPage(i + 1);
        const viewport = page.getViewport({ scale: 2.0 });

        // Prepare canvas using PDF page dimensions
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        const renderTask = page.render(renderContext);
        await renderTask.promise;
        const url = canvas.toDataURL();
        urlList.current[i] = url;
      }),
    );
    setLoading(false);
  }
  useEffect(() => {
    initDocument(url);
  }, [url]);

  return { loading, urlList: urlList.current };
}
