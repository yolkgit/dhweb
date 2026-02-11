import React, { useRef } from 'react';
import { Upload, X, Link as LinkIcon, Film, Play } from 'lucide-react';

interface VideoInputProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
}

const VideoInput: React.FC<VideoInputProps> = ({ label, value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Limit to 50MB for server upload
      if (file.size > 50 * 1024 * 1024) {
        alert("파일 용량이 너무 큽니다. 50MB 이하의 영상을 선택해주세요.");
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
        alert("영상 업로드에 실패했습니다.");
      }
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-bold text-slate-600 mb-2">{label}</label>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Preview Area */}
        <div className="w-full sm:w-48 h-32 bg-slate-900 rounded-lg border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative group">
          {value ? (
            <>
              <video 
                src={value} 
                className="w-full h-full object-cover opacity-80" 
                muted 
                playsInline
                // Prevent auto-play in admin to save resources, just show poster/frame if possible
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Play className="text-white/80 w-8 h-8" />
              </div>
              <button 
                type="button"
                onClick={() => onChange('')}
                className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10"
              >
                <div className="flex flex-col items-center gap-1">
                   <X size={24} />
                   <span className="text-xs font-bold">삭제</span>
                </div>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center text-slate-500">
                <Film size={24} className="mb-1 opacity-50"/>
                <span className="text-[10px]">영상 없음</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 w-full space-y-3">
          {/* File Upload Button */}
          <div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="video/mp4,video/webm" 
              onChange={handleFileChange}
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 text-sm font-bold hover:bg-slate-50 transition shadow-sm w-full sm:w-auto justify-center"
            >
              <Upload size={16} />
              동영상 업로드 (서버 저장)
            </button>
            <p className="text-[10px] text-slate-400 mt-1 ml-1 leading-tight">
               * 최대 50MB. (MP4, WEBM 지원)
            </p>
          </div>

          {/* URL Input (Fallback) */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded px-3 py-2">
            <LinkIcon size={14} className="text-slate-400 shrink-0" />
            <input 
              type="text" 
              value={value || ''} 
              onChange={(e) => onChange(e.target.value)}
              placeholder="또는 영상 주소(URL) 직접 입력"
              className="flex-1 text-sm outline-none text-slate-600 bg-transparent placeholder:text-slate-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInput;