import React, { useRef, useState } from 'react';
import { Upload, X, Link as LinkIcon, Image as ImageIcon, FolderOpen } from 'lucide-react';
import FileSelectorModal from './FileSelectorModal';

interface ImageInputProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ label, value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
      if (file) {
        // Validation for size (optional, server middleware can also handle this)
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
           alert("파일 용량이 너무 큽니다. 50MB 이하의 파일을 선택해주세요.");
           return;
        }

        const formData = new FormData();
        formData.append('file', file);
  
        try {
          // Upload to server
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (!res.ok) throw new Error('Upload failed');
          
          const data = await res.json();
          onChange(data.url); // Set the URL returned from server
        } catch (err) {
          console.error(err);
          alert("이미지 업로드에 실패했습니다. 서버 상태를 확인해주세요.");
        }
      }
    };

  return (
    <div className="mb-4">
      <label className="block text-sm font-bold text-slate-600 mb-2">{label}</label>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Preview Area */}
        <div className="w-full sm:w-32 h-32 sm:h-24 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative group">
          {value ? (
            <>
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={() => onChange('')}
                className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center text-slate-400">
                <ImageIcon size={24} className="mb-1 opacity-50"/>
                <span className="text-[10px]">이미지 없음</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 w-full space-y-3">
          {/* File Upload Buttons */}
          <div className="flex gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 text-sm font-bold hover:bg-slate-50 transition shadow-sm justify-center"
            >
              <Upload size={16} />
              업로드
            </button>
            <button 
              type="button" 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-700 text-sm font-bold hover:bg-slate-200 transition shadow-sm justify-center"
            >
              <FolderOpen size={16} />
              서버 선택
            </button>
          </div>

          <FileSelectorModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSelect={onChange} 
            filter="image"
          />

          {/* URL Input (Fallback) */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded px-3 py-2">
            <LinkIcon size={14} className="text-slate-400 shrink-0" />
            <input 
              type="text" 
              value={value || ''} 
              onChange={(e) => onChange(e.target.value)}
              placeholder="또는 이미지 주소(URL) 직접 입력"
              className="flex-1 text-sm outline-none text-slate-600 bg-transparent placeholder:text-slate-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageInput;