'use client';
import React, { useEffect } from 'react';
import { FileType } from '@/pages/agent/biding-agent';
import * as pdfjsLib from 'pdfjs-dist';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer.mjs';
//@ts-ignore
import PDFWorker from 'pdfjs-dist/build/pdf.worker.mjs';
//@ts-ignore
import SANDBOX_BUNDLE_SRC from 'pdfjs-dist/build/pdf.sandbox.mjs';
import 'pdfjs-dist/web/pdf_viewer.css';
import Script from 'next/script';

pdfjsLib.GlobalWorkerOptions.workerSrc = PDFWorker;
const document = window.document;

interface PDFViewerProps {
  scale?: number;
  url: string;
  fileType: FileType;
}

export default function Index(props: PDFViewerProps) {
  const { url, scale = 1.0, fileType } = props;
  useEffect(() => {
    console.log('pdfjsViewer', pdfjsViewer.EventBus);
    initPdf(url);
  }, [url]);

  async function initPdf(url: string) {
    if (!pdfjsLib.getDocument || !pdfjsViewer.PDFViewer) {
      // eslint-disable-next-line no-alert
      alert('Please build the pdfjs-dist library using\n  `gulp dist-install`');
    }
    const CMAP_URL = '../../node_modules/pdfjs-dist/cmaps/';
    const CMAP_PACKED = true;
    const ENABLE_XFA = true;
    const SEARCH_FOR = ''; // try "Mozilla";

    const container = window.document.getElementById('viewerContainer') as HTMLDivElement;
    const eventBus = new pdfjsViewer.EventBus();

    // (Optionally) enable hyperlinks within PDF files.
    const pdfLinkService = new pdfjsViewer.PDFLinkService({
      eventBus,
    });

    // (Optionally) enable find controller.
    const pdfFindController = new pdfjsViewer.PDFFindController({
      eventBus,
      linkService: pdfLinkService,
    });

    // (Optionally) enable scripting support.
    const pdfScriptingManager = new pdfjsViewer.PDFScriptingManager({
      eventBus,
      sandboxBundleSrc: SANDBOX_BUNDLE_SRC,
    });

    const pdfViewer = new pdfjsViewer.PDFViewer({
      container,
      eventBus,
      linkService: pdfLinkService,
      findController: pdfFindController,
      scriptingManager: pdfScriptingManager,
    });
    pdfLinkService.setViewer(pdfViewer);
    pdfScriptingManager.setViewer(pdfViewer);

    eventBus.on('pagesinit', function () {
      // We can use pdfViewer now, e.g. let's change default scale.
      pdfViewer.currentScaleValue = 'page-width';

      // We can try searching for things.
      if (SEARCH_FOR) {
        eventBus.dispatch('find', { type: '', query: SEARCH_FOR });
      }
    });

    // Loading document.
    const loadingTask = pdfjsLib.getDocument({
      url,
      cMapUrl: CMAP_URL,
      cMapPacked: CMAP_PACKED,
      enableXfa: ENABLE_XFA,
    });

    const pdfDocument = await loadingTask.promise;
    // Document loaded, specifying document for the viewer and
    // the (optional) linkService.
    pdfViewer.setDocument(pdfDocument);

    pdfLinkService.setDocument(pdfDocument, null);
  }
  const goPage = (page: number) => {
    window.document.querySelector(`pdf-viewer-img-${page}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="viewerContainer" className="w-full h-full overflow-y-auto absolute">
      <div id="viewer"></div>
    </div>
  );
}
