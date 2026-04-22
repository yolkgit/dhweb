import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/Section';
import { ArrowRight, CheckCircle2, ShieldCheck, Clock, Truck, Youtube, Tag, Play, X, Loader2, AlertTriangle, ExternalLink, ChevronDown } from 'lucide-react';

import { HeroSlide } from '../types'; // Ensure types is imported if needed, though ContentContext might export it or global. 
// Assuming useContent provides context but we need type for component props.
// Let's check imports.
import { useContent } from '../context/ContentContext';

// Subcomponent for individual slide logic (video control)
const HeroSlideItem: React.FC<{
  slide: HeroSlide;
  isActive: boolean;
  onComplete: () => void;
}> = ({ slide, isActive, onComplete }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (slide.type === 'video' && videoRef.current) {
      if (isActive) {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Auto-play was prevented
          });
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, slide.type]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (slide.fadeOutDuration && slide.fadeOutDuration > 0 && isActive) {
      const video = e.currentTarget;
      if (video.duration > 0 && (video.duration - video.currentTime <= slide.fadeOutDuration)) {
        onComplete();
      }
    }
  };

  return (
    <div 
      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
      }`}
    >
      {slide.type === 'video' ? (
        <video 
          ref={videoRef}
          autoplay
          muted 
          playsInline
          onEnded={() => isActive && onComplete()} 
          onTimeUpdate={handleTimeUpdate}
          poster={slide.poster}
          className="w-full h-full object-cover"
        >
          <source src={slide.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img 
          src={slide.src} 
          alt={slide.title} 
          className="w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
    </div>
  );
};

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
}

const Home: React.FC = () => {
  const { companyInfo, products, playlists, appSettings, heroSlides, currentLang, certificationMarks, categories } = useContent();
  
  // State to store fetched videos for each category
  const [videoLists, setVideoLists] = useState<Record<string, VideoItem[]>>({});
  // Loading state
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  // Popup Video State
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Helper to go to next slide
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  // Auto-advance slider
  useEffect(() => {
    if (!heroSlides || heroSlides.length <= 1) return;

    const currentSlideData = heroSlides[currentSlide];
    
    // Safety check for currentSlideData
    if (!currentSlideData) return;

    // Use timer for images (or undetermined types)
    // Videos handle their own progression via onEnded
    if (currentSlideData.type !== 'video') {
      // Ensure specific duration is used, fallback to 6, enforce min 3s
      let rawDuration = currentSlideData.duration;
      // Handle potential string/null cases safely
      const durationSec = typeof rawDuration === 'number' ? rawDuration : parseFloat(rawDuration as any) || 6;
      const durationMs = Math.max(durationSec, 3) * 1000;
      
      const timer = setTimeout(() => {
        handleNextSlide();
      }, durationMs);
      
      return () => clearTimeout(timer);
    }
  }, [currentSlide, heroSlides]);

  useEffect(() => {
    const fetchAllPlaylists = async () => {
      const lists: Record<string, VideoItem[]> = {};
      const loadingStates: Record<string, boolean> = {};

      // Initialize loading states
      for (const cat of categories) {
         const pid = playlists[cat.id];
         if (pid && (pid.startsWith('PL') || pid.startsWith('UU'))) {
            loadingStates[cat.id] = true;
         }
      }
      setIsLoading(prev => ({ ...prev, ...loadingStates }));

      for (const cat of categories) {
        const playlistId = playlists[cat.id]?.trim();
        
        // Skip if no ID or if it's likely a single video ID
        if (!playlistId || (!playlistId.startsWith('PL') && !playlistId.startsWith('UU'))) {
          continue;
        }

        try {
          let items: VideoItem[] = [];

          // RSS 2 JSON API 사용 (API 키 불필요, CORS 우회 프록시 문제 해결)
          const RSS_URL = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;
          const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`);
          
          if (!res.ok) throw new Error('RSS 데이터 로드 실패');
          
          const data = await res.json();
          if (data.status === 'ok') {
            items = data.items.map((item: any) => {
              let videoId = '';
              try {
                const url = new URL(item.link);
                videoId = url.searchParams.get('v') || '';
              } catch (e) {
                videoId = item.link.split('v=')[1]?.split('&')[0] || '';
              }
              // 비디오 ID 파싱 실패시 다른 방법으로 시도
              if (!videoId && item.guid) {
                const parts = item.guid.split(':');
                videoId = parts[parts.length - 1];
              }

              return { 
                id: videoId, 
                title: item.title, 
                // rss2json에서 제공하는 thumbnail 사용, 없으면 직접 조합
                thumbnail: item.thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` 
              };
            }).filter((item: any) => item.id);
          }

          if (items.length > 0) {
            lists[cat.id] = items;
          }
        } catch (error) {
          console.error(`Failed to fetch playlist for ${cat.id}`, error);
        } finally {
          loadingStates[cat.id] = false;
        }
      }
      
      setVideoLists(prev => ({ ...prev, ...lists }));
      setIsLoading(prev => ({ ...prev, ...loadingStates }));
    };

    fetchAllPlaylists();
  }, [playlists, appSettings.youtubeApiKey, categories]);

  // Handle opening the video modal
  const openVideoModal = (video: VideoItem) => {
    setSelectedVideo(video);
    document.body.style.overflow = 'hidden';
  };

  // Handle closing the video modal
  const closeVideoModal = () => {
    setSelectedVideo(null);
    document.body.style.overflow = 'unset';
  };

  // Construct valid iframe src
  const getIframeSrc = (videoId: string) => {
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  };

  // Safety check for empty slides
  const activeSlide = heroSlides[currentSlide] || heroSlides[0];

  return (
    <div className="flex flex-col">
      {/* Dynamic Hero Section with Crossfade */}
      <div className="relative h-screen min-h-[700px] flex items-center justify-center bg-slate-900 overflow-hidden">
        
        {/* Background Slides */}
        {heroSlides.map((slide, index) => (
          <HeroSlideItem 
            key={slide.id}
            slide={slide}
            isActive={currentSlide === index}
            onComplete={handleNextSlide}
          />
        ))}

        {/* Content Overlay */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-16">
          <div className="max-w-4xl">
            {/* Animated Text */}
            {activeSlide && (
              <div key={activeSlide.id} className="animate-fade-in-up">
                <h2 className="text-emerald-400 font-bold text-lg md:text-xl mb-6 tracking-widest uppercase flex items-center gap-3">
                  <span className="w-12 h-0.5 bg-emerald-400 inline-block"></span>
                  {activeSlide.title}
                </h2>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-8 drop-shadow-lg">
                  {activeSlide.subtitle.split('\n').map((line, i) => (
                    <span key={i} className="block">{line}</span>
                  ))}
                </h1>
                <p className="text-lg md:text-2xl text-slate-200 mb-10 leading-relaxed max-w-2xl drop-shadow-md font-light border-l-4 border-emerald-500 pl-6">
                  {activeSlide.desc}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/products" className="inline-flex items-center justify-center px-10 py-5 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/30 group text-lg">
                    제품 살펴보기
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/contact" className="inline-flex items-center justify-center px-10 py-5 bg-white/10 backdrop-blur-md text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/30 text-lg">
                    견적 문의하기
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'w-12 bg-emerald-500' : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Hint */}
        <div className="absolute bottom-8 right-8 z-30 hidden md:flex flex-col items-center text-white/50 animate-bounce">
           <span className="text-xs tracking-widest uppercase mb-2">Scroll</span>
           <ChevronDown size={20} />
        </div>
      </div>

      {/* Core Values Section */}
      <Section>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Dahyeon?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            다현산업은 고객의 만족을 위해 4가지 핵심 가치를 약속드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: ShieldCheck, title: '우수한 품질', desc: '엄격한 QC와 KS 기준 준수' },
            { icon: CheckCircle2, title: '착한 가격', desc: '자체 생산을 통한 원가 절감' },
            { icon: Clock, title: '정확한 납기', desc: '체계적인 생산 스케줄 관리' },
            { icon: Truck, title: '빠른 서비스', desc: '신속한 현장 대응 및 A/S' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group">
              <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-600 group-hover:rotate-6 transition-all duration-300">
                <item.icon className="w-10 h-10 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Categories with Representative Product & Video Playlist */}
      <div className="bg-slate-50">
        <div className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center mb-8">
             <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Products & Videos</h2>
             <p className="text-slate-600 max-w-2xl mx-auto">
              카테고리별 대표 제품과 다양한 시공 영상을 확인해보세요.
            </p>
          </div>

          {categories.map((category, idx) => {
            const representativeProduct = products.find(p => p.category === category.id);
            if (!representativeProduct) return null;

            const playlistId = playlists[category.id];
            const hasVideoList = videoLists[category.id] && videoLists[category.id].length > 0;
            const items = videoLists[category.id] || [];
            
            // Alternate layout
            const isReverse = idx % 2 !== 0;

            return (
              <div key={category.id} className="scroll-mt-20">
                {/* Category Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-emerald-600 font-bold tracking-wider text-sm uppercase">Category 0{idx + 1}</span>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">{category.label}</h3>
                  </div>
                  <Link to="/products" className="text-slate-500 hover:text-emerald-600 font-medium text-sm flex items-center mt-4 md:mt-0 transition-colors">
                    전체 제품 보기 <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>

                <div className={`flex flex-col gap-8 lg:gap-12 ${isReverse ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                  {/* Product Card Side */}
                  <div className="w-full lg:w-4/12 flex flex-col">
                    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:border-emerald-500/30">
                      <div className="relative h-56 overflow-hidden bg-slate-200 shrink-0">
                        <img 
                          src={representativeProduct.imageUrl} 
                          alt={representativeProduct.name} 
                          className="w-full h-full object-contain p-2 bg-white group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                           <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded shadow-sm">대표제품</span>
                           {representativeProduct.isEco && <span className="bg-emerald-400 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm"><CheckCircle2 size={10} />ECO</span>}
                        </div>
                        {/* Certification Marks (Top Right) */}
                        {representativeProduct.certificationMarkIds && representativeProduct.certificationMarkIds.length > 0 && (
                           <div className="absolute top-3 right-3 flex gap-1">
                              {representativeProduct.certificationMarkIds.map(markId => {
                                 const mark = certificationMarks.find(m => m.id === markId);
                                 if (!mark || !mark.imageUrl) return null;
                                 return (
                                   <div key={markId} className="w-16 h-16 flex items-center justify-center" title={mark.name}>
                                      <img src={mark.imageUrl} alt={mark.name} className="w-full h-full object-contain drop-shadow-md" />
                                   </div>
                                 );
                              })}
                           </div>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{representativeProduct.name}</h4>
                        <p className="text-slate-600 mb-6 flex-grow leading-relaxed line-clamp-4">{representativeProduct.description}</p>
                        
                        <div className="space-y-2 mb-8">
                          {representativeProduct.features.slice(0, 3).map((f, i) => (
                            <div key={i} className="flex items-center text-sm text-slate-500">
                              <Tag size={14} className="text-emerald-500 mr-2 shrink-0" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>

                        <Link to="/products" className="w-full py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all text-center flex items-center justify-center">
                          자세히 보기 <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Video Grid Side */}
                  <div className="w-full lg:w-8/12 flex flex-col bg-white/50 border border-white/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-sm">
                     <div className="flex justify-between items-center mb-4">
                       <h5 className="text-slate-900 font-bold flex items-center text-lg">
                          <Youtube className="w-6 h-6 text-red-600 mr-2" />
                          관련 시공 영상
                       </h5>
                       {hasVideoList && (
                         <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                           {items.length} Videos
                         </span>
                       )}
                     </div>
                      
                      {isLoading[category.id] ? (
                        <div className="flex-1 flex flex-col items-center justify-center h-64 bg-slate-200 rounded-lg">
                           <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
                           <span className="text-sm text-slate-500 font-bold">Loading...</span>
                        </div>
                      ) : hasVideoList ? (
                        /* GRID LAYOUT: 3 columns, limited height for ~2 rows, scrollable */
                        <div style={{ maxHeight: '400px' }} className="overflow-y-auto custom-scrollbar p-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                           {items.map((video) => (
                             <button 
                               key={video.id}
                               onClick={() => openVideoModal(video)}
                               className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 text-left"
                             >
                               {/* Thumbnail with overlay */}
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
                               {/* Title */}
                               <div className="p-3">
                                  <h6 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors">
                                    {video.title}
                                  </h6>
                               </div>
                             </button>
                           ))}
                          </div>
                        </div>
                      ) : (
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
                      )}
                      
                      <div className="mt-4 text-xs text-right text-slate-400">
                        * {currentLang === 'ko' ? '영상을 클릭하면 팝업으로 재생됩니다.' : 'Click to play in popup.'}
                      </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 4px;
            border: 2px solid #f1f5f9;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #94a3b8;
          }
        `}</style>
      </div>

      {/* R&D Teaser */}
      <section className="relative overflow-hidden bg-emerald-900 text-white py-16 md:py-24">
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">끊임없는 연구개발과 혁신</h2>
          <p className="text-emerald-100 mb-8 text-lg">
            기업부설연구소를 운영하여 국제 표준에 부합하는 품질 관리와 신제품 개발에 매진하고 있습니다.<br className="hidden md:block" />
            ISO 인증, 환경표지인증, 다수의 특허가 다현산업의 기술력을 증명합니다.
          </p>
          <Link to="/technology" className="inline-block border-2 border-white px-8 py-3 rounded-full text-white font-bold hover:bg-white hover:text-emerald-900 transition-colors">
            기술연구소 소개
          </Link>
        </div>
      </section>

      {/* Video Modal Popup */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in-up">
           <button 
             onClick={closeVideoModal}
             className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 z-50"
           >
             <X size={32} />
           </button>
           
           <div className="w-full max-w-5xl bg-black rounded-xl overflow-hidden shadow-2xl flex flex-col">
              <div className="relative aspect-video w-full bg-black">
                <iframe 
                  src={getIframeSrc(selectedVideo.id)}
                  title={selectedVideo.title}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              
              {/* Fallback Link & Title */}
              <div className="p-4 bg-slate-900 text-white border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <h3 className="text-lg font-bold line-clamp-1">{selectedVideo.title}</h3>
                 <a 
                   href={`https://www.youtube.com/watch?v=${selectedVideo.id}`} 
                   target="_blank" 
                   rel="noreferrer"
                   className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors shrink-0"
                 >
                   <span className="bg-red-600 text-white px-2 py-1 rounded font-bold">YouTube</span>
                   <span>{currentLang === 'ko' ? '에서 직접 보기 (재생 오류 시)' : 'Watch on YouTube'}</span>
                   <ExternalLink size={12} />
                 </a>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Home;