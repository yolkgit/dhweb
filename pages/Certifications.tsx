import React, { useState } from 'react';
import Section from '../components/Section';
import { useContent } from '../context/ContentContext';
import { Award, FileText, X, Maximize2 } from 'lucide-react';
import PdfViewer from '../components/PdfViewer';
import { usePageSeo } from '../utils/seo';

const Certifications: React.FC = () => {
  usePageSeo(
    '인증 및 특허',
    '상온아스콘·도로보수재 관련 특허 및 공인기관 품질 인증 현황. 주식회사 다현산업이 보유한 기술 특허와 시험성적서를 확인하실 수 있습니다.'
  );
  const { certifications } = useContent();
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [selectedPdfTitle, setSelectedPdfTitle] = useState<string>("");

  const handlePdfClick = (url: string, title: string) => {
    setSelectedPdf(url);
    setSelectedPdfTitle(title);
  };

  return (
    <div>
      <div className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Certifications & Patents</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            공인기관이 인증한 다현산업의 우수한 기술력과 특허 현황을 소개합니다.
          </p>
        </div>
      </div>

      {/* Certifications Grid */}
      <Section>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">인증 및 특허 현황</h2>
          <p className="text-slate-600">
            공인기관이 검증한 다현산업의 특허 및 품질 인증서 목록입니다. 이미지를 클릭하시면 원본 문서를 확인하실 수 있습니다.
          </p>
        </div>

        {/* 5 Columns Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {certifications.map((cert) => (
            <div 
              key={cert.id} 
              onClick={() => cert.pdfUrl && handlePdfClick(cert.pdfUrl, cert.title)}
              className={`bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden group flex flex-col transition-all duration-300 relative ${cert.pdfUrl ? 'cursor-pointer hover:-translate-y-2 hover:shadow-xl' : ''}`}
            >
              {/* PDF Preview Area (A4 Ratio approx) */}
              <div className="relative aspect-[1/1.414] bg-slate-100 w-full overflow-hidden border-b border-slate-100 group">
                {cert.pdfUrl ? (
                  <>
                    <PdfViewer 
                      url={cert.pdfUrl} 
                      className="w-full h-full object-contain pointer-events-none" 
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-emerald-900/10 transition-colors flex items-center justify-center z-10">
                       <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/90 text-emerald-700 p-3 rounded-full shadow-lg backdrop-blur-sm">
                          <Maximize2 size={24} />
                       </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 p-4">
                    <Award size={48} className="mb-2 opacity-50" />
                    <span className="text-xs">No Image</span>
                  </div>
                )}
              </div>

              {/* Info Area */}
              <div className="p-4 flex flex-col flex-grow text-center bg-white z-20 relative">
                <div className="mb-2">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${cert.type === 'PATENT' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                    {cert.type === 'PATENT' ? '특허' : '인증'}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-1 group-hover:text-emerald-600 transition-colors">
                  {cert.title}
                </h3>
                <p className="text-xs text-slate-500 mt-auto pt-2 border-t border-slate-50">
                  {cert.issuer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* PDF Modal */}
      {selectedPdf && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-lg shadow-2xl flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50 shrink-0">
              <h3 className="font-bold text-lg text-slate-800 flex items-center truncate pr-4">
                <FileText className="mr-2 text-emerald-600 shrink-0" />
                {selectedPdfTitle}
              </h3>
              <button 
                onClick={() => setSelectedPdf(null)} 
                className="p-2 hover:bg-slate-200 rounded-full transition text-slate-500 hover:text-slate-800 shrink-0"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 bg-slate-100 overflow-auto flex items-center justify-center p-4 md:p-8">
              <div className="shadow-xl bg-white max-w-full">
                <PdfViewer 
                  url={selectedPdf} 
                  interactive={true} 
                  className="w-full h-auto min-h-[500px]"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certifications;
