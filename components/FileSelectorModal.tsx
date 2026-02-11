import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, FileText, Check, Loader2 } from 'lucide-react';

interface FileSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  filter?: 'image' | 'pdf' | 'all';
}

const FileSelectorModal: React.FC<FileSelectorModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  filter = 'all' 
}) => {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchFiles();
    }
  }, [isOpen]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/uploads');
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      }
    } catch (error) {
      console.error("Failed to fetch files", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Filter Logic
  const filteredFiles = files.filter(url => {
    const lowerUrl = url.toLowerCase();
    const isImage = lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/);
    const isPdf = lowerUrl.endsWith('.pdf');
    const matchesSearch = url.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'image') return isImage;
    if (filter === 'pdf') return isPdf;
    return true;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">서버 저장 파일 선택</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b flex gap-4 bg-white z-10">
           <input 
             type="text" 
             placeholder="파일명 검색..." 
             className="flex-1 px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
             <button 
             onClick={fetchFiles}
             className="px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium"
           >
             새로고침
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
               <span className="mb-2">검색 결과가 없습니다.</span>
               <span className="text-xs">파일을 먼저 업로드해주세요.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredFiles.map((url) => {
                 const isImage = url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
                 const fileName = url.split('/').pop();

                 return (
                   <div 
                     key={url} 
                     onClick={() => { onSelect(url); onClose(); }}
                     className="group cursor-pointer bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-emerald-500 hover:shadow-md transition relative aspect-square flex flex-col"
                   >
                     {isImage ? (
                       <div className="w-full h-full bg-slate-100 relative">
                         <img src={url} alt={fileName} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                       </div>
                     ) : (
                       <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-slate-400 p-4">
                         <FileText size={32} className="mb-2 text-slate-300 group-hover:text-emerald-500 transition" />
                         <span className="text-[10px] text-center w-full truncate">{fileName}</span>
                       </div>
                     )}
                     
                     {/* Overlay Label */}
                     <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur px-2 py-1 border-t text-[10px] text-slate-600 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {fileName}
                     </div>

                     {/* Selection Effect */}
                     <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 shadow-sm">
                        <Check size={12} />
                     </div>
                   </div>
                 );
              })}
            </div>
          )}
        </div>

        <div className="p-3 bg-white border-t text-xs text-center text-slate-400">
           총 {filteredFiles.length}개의 파일이 있습니다.
        </div>
      </div>
    </div>
  );
};

export default FileSelectorModal;
