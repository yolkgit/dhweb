import React, { useRef, useState } from 'react';
import { Upload, X, FileText, Eye, FolderOpen } from 'lucide-react';
import FileSelectorModal from './FileSelectorModal';

interface PdfInputProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
}

const PdfInput: React.FC<PdfInputProps> = ({ label, value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert("PDF 파일만 업로드 가능합니다.");
        return;
      }

      // 50MB limit for server
      if (file.size > 50 * 1024 * 1024) {
        alert("파일 용량이 너무 큽니다. (최대 50MB)");
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Upload failed');

        const data = await res.json();
        onChange(data.url);
      } catch (err) {
        console.error(err);
        alert("PDF 업로드 실패. 코드를 확인해주세요.");
      }
    }
  };

  const handlePreview = () => {
    if (!value) return;
    const win = window.open();
    if (win) {
      win.document.write(
        `<iframe src="${value}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
      );
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-bold text-slate-600 mb-2">{label}</label>
      
      <div className="flex items-center gap-4">
        {value ? (
          <div className="flex-1 flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <div className="flex items-center gap-3">
              <FileText size={24} />
              <div>
                <span className="text-sm font-bold block">PDF 파일 등록됨</span>
                <button 
                  type="button" 
                  onClick={handlePreview}
                  className="text-xs underline hover:text-red-900 flex items-center gap-1 mt-1"
                >
                  <Eye size={12} /> 미리보기 (새창)
                </button>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => onChange('')}
              className="p-2 hover:bg-red-100 rounded-full transition-colors"
              title="삭제"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="flex-1 flex gap-2">
             <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="application/pdf" 
              onChange={handleFileChange}
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-dashed border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50 hover:border-emerald-400 hover:text-emerald-600 transition-all font-medium text-sm"
            >
              <Upload size={18} />
              PDF 업로드
            </button>
            <button 
              type="button" 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-all font-bold text-sm flex items-center gap-2"
            >
              <FolderOpen size={18} />
              서버 선택
            </button>
            
            <FileSelectorModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              onSelect={onChange} 
              filter="pdf"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfInput;