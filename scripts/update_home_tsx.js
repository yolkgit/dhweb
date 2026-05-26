const fs = require('fs');
const path = require('path');

const homePath = path.join(__dirname, '..', 'pages', 'Home.tsx');
let content = fs.readFileSync(homePath, 'utf8');

// 1. Update imports
const importLucideRegex = /import\s+\{\s*([^}]+)\s*\}\s+from\s+'lucide-react';/;
const importMatch = content.match(importLucideRegex);
if (importMatch) {
  let imports = importMatch[1];
  if (!imports.includes('ChevronLeft')) imports += ', ChevronLeft';
  if (!imports.includes('ChevronRight')) imports += ', ChevronRight';
  if (!imports.includes('ImageIcon')) imports += ', ImageIcon';
  content = content.replace(importLucideRegex, `import { ${imports} } from 'lucide-react';`);
}

// 2. Insert CategorySlideshow before `const Home: React.FC = () => {`
const homeDeclIdx = content.indexOf('const Home: React.FC = () => {');
if (homeDeclIdx !== -1 && content.indexOf('const CategorySlideshow') === -1) {
  const slideshowComponent = `
const CategorySlideshow: React.FC<{ images: string[], categoryLabel: string }> = ({ images, categoryLabel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const prev = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-slate-900 font-bold flex items-center text-lg">
           <ImageIcon className="w-6 h-6 text-emerald-600 mr-2" />
           {categoryLabel} 현장 사진
        </h5>
        <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
          {images.length} Photos
        </span>
      </div>
      
      <div className="relative flex-1 bg-slate-100 rounded-lg overflow-hidden group min-h-[300px]">
        <img 
          src={images[currentIndex]} 
          alt={\`\${categoryLabel} 슬라이드 \${currentIndex + 1}\`} 
          className="w-full h-full object-cover absolute inset-0 transition-opacity duration-500" 
        />
        
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronLeft size={20} />
            </button>
            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={20} />
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={\`w-2 h-2 rounded-full transition-all \${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'}\`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

`;
  content = content.slice(0, homeDeclIdx) + slideshowComponent + content.slice(homeDeclIdx);
}

// 3. Replace Video Grid Side
const videoGridStart = content.indexOf('{/* Video Grid Side */}');
const videoGridEndStr = '</div>\r\n                </div>\r\n              </div>\r\n            );\r\n          })}\r\n        </div>';
let videoGridEnd = content.indexOf(videoGridEndStr);

if (videoGridEnd === -1) {
    const videoGridEndStr2 = '</div>\n                </div>\n              </div>\n            );\n          })}\n        </div>';
    videoGridEnd = content.indexOf(videoGridEndStr2);
}

if (videoGridStart !== -1 && videoGridEnd !== -1) {
  const replacement = `                  {/* Video Grid Side */}
                  <div className="w-full lg:w-8/12 flex flex-col bg-white/50 border border-white/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-sm">
                     {(() => {
                       const slideImages = category.slideImages || [];
                       const hasSlideImages = slideImages.length > 0;
                       
                       if (isLoading[category.id]) {
                         return (
                           <div className="flex-1 flex flex-col items-center justify-center h-64 bg-slate-200 rounded-lg">
                              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
                              <span className="text-sm text-slate-500 font-bold">Loading...</span>
                           </div>
                         );
                       }
                       
                       if (hasVideoList) {
                         return (
                           <>
                             <div className="flex justify-between items-center mb-4">
                               <h5 className="text-slate-900 font-bold flex items-center text-lg">
                                  <Youtube className="w-6 h-6 text-red-600 mr-2" />
                                  관련 시공 영상
                               </h5>
                               <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                                 {items.length} Videos
                               </span>
                             </div>
                             <div style={{ maxHeight: '400px' }} className="overflow-y-auto custom-scrollbar p-2">
                               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {items.map((video) => (
                                  <button 
                                    key={video.id}
                                    onClick={() => openVideoModal(video)}
                                    className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 text-left"
                                  >
                                    <div className="relative aspect-video bg-slate-800 overflow-hidden">
                                       <img 
                                         src={video.thumbnail} 
                                         alt={video.title} 
                                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" 
                                       />
                                       <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                          <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-red-600 shadow-lg group-hover:scale-110 transition-transform">
                                             <Play size={18} fill="currentColor" className="ml-0.5" />
                                          </div>
                                       </div>
                                    </div>
                                    <div className="p-3">
                                       <h6 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors">
                                         {video.title}
                                       </h6>
                                    </div>
                                  </button>
                                ))}
                               </div>
                             </div>
                             <div className="mt-4 text-xs text-right text-slate-400">
                               * {currentLang === 'ko' ? '영상을 클릭하면 팝업으로 재생됩니다.' : 'Click to play in popup.'}
                             </div>
                           </>
                         );
                       }
                       
                       if (hasSlideImages) {
                         return <CategorySlideshow images={slideImages} categoryLabel={category.label} />;
                       }
                       
                       // No videos and no slide images
                       return (
                         <>
                           <div className="flex justify-between items-center mb-4">
                             <h5 className="text-slate-900 font-bold flex items-center text-lg">
                                <Youtube className="w-6 h-6 text-red-600 mr-2" />
                                관련 시공 영상
                             </h5>
                           </div>
                           <div className="flex-1 flex flex-col items-center justify-center h-64 bg-slate-100 rounded-lg text-slate-500 border border-dashed border-slate-300">
                             {appSettings.youtubeApiKey ? (
                                <>
                                  <Youtube size={48} className="mb-4 opacity-30" />
                                  <p className="font-medium">등록된 영상이 없습니다.</p>
                                </>
                             ) : (
                               <>
                                  <AlertTriangle size={32} className="mb-4 text-amber-500" />
                                  <p className="font-medium">영상 리스트를 불러올 수 없습니다.</p>
                                  <p className="text-xs mt-2">관리자 페이지에서 API Key를 확인해주세요.</p>
                               </>
                             )}
                           </div>
                         </>
                       );
                     })()}
`;
  content = content.slice(0, videoGridStart) + replacement + content.slice(videoGridEnd);
} else {
  console.error('Could not find video grid boundaries');
  process.exit(1);
}

fs.writeFileSync(homePath, content, 'utf8');
console.log('SUCCESS: Home.tsx updated');
