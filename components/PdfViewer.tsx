import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight, ZoomIn, Loader2 } from 'lucide-react';

// Fix for import structure: handle both named exports and default export
// Some CDN builds (like esm.sh) might bundle it such that everything is under 'default'.
const pdfjs: any = (pdfjsLib as any).default || pdfjsLib;

// Set worker source
// Using cdnjs for the worker is often more reliable than esm.sh for importScripts because it serves a classic script file.
if (pdfjs.GlobalWorkerOptions) {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

interface PdfViewerProps {
  url: string;
  className?: string;
  interactive?: boolean; // If true, shows navigation controls
  onLoadComplete?: (numPages: number) => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url, className = "", interactive = false, onLoadComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load PDF Document
  useEffect(() => {
    let isMounted = true;
    const loadPdf = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }
        
        // Use the resolved pdfjs object
        const loadingTask = pdfjs.getDocument(url);
        const doc = await loadingTask.promise;
        
        if (isMounted) {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          if (onLoadComplete) onLoadComplete(doc.numPages);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading PDF:", err);
        if (isMounted) {
          setError("PDF를 불러올 수 없습니다.");
          setLoading(false);
        }
      }
    };

    if (url) {
      loadPdf();
    }
    
    return () => { isMounted = false; };
  }, [url]);

  // Render Page
  useEffect(() => {
    let renderTask: any = null;

    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return;

      try {
        const page = await pdfDoc.getPage(currentPage);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        // Calculate scale to fit container width
        // We get the parent width to determine scale
        const parentWidth = canvas.parentElement?.clientWidth || 500;
        const viewport = page.getViewport({ scale: 1.0 });
        
        // Determine scale: Make it fit width, but for thumbnails maybe fixed height?
        // Let's rely on CSS sizing. We render at high res then scale down via CSS if needed.
        // For crisp rendering, we might want a slightly higher scale.
        const scale = parentWidth / viewport.width; 
        // Cap scale to avoid massive memory usage on huge screens, but keep it sharp.
        const safeScale = interactive ? Math.min(scale * 1.5, 3) : 1.0; 
        
        const scaledViewport = page.getViewport({ scale: safeScale });

        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport,
        };

        // Cancel previous render if any
        if (renderTask) {
             renderTask.cancel();
        }
        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException') {
            console.error("Error rendering page:", err);
        }
      }
    };

    renderPage();
    
    return () => {
        if (renderTask) {
            renderTask.cancel();
        }
    };
  }, [pdfDoc, currentPage, interactive]); // Re-render on resize logic could be added here

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPage < numPages) setCurrentPage(prev => prev + 1);
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 text-slate-400 text-xs ${className}`}>
        {error}
      </div>
    );
  }

  return (
    <div className={`relative bg-white flex flex-col items-center justify-center overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
          <Loader2 className="animate-spin text-emerald-600" size={24} />
        </div>
      )}
      
      <canvas ref={canvasRef} className="max-w-full h-auto shadow-sm" />

      {/* Navigation Controls (Only for interactive mode) */}
      {interactive && numPages > 1 && (
        <>
          <button 
            onClick={handlePrev}
            disabled={currentPage <= 1}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 disabled:opacity-30 transition-all z-20"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={handleNext}
            disabled={currentPage >= numPages}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 disabled:opacity-30 transition-all z-20"
          >
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm z-20">
            {currentPage} / {numPages}
          </div>
        </>
      )}
    </div>
  );
};

export default PdfViewer;