import React from 'react';
import { useYouTubeVideos } from '../hooks/useYouTubeVideos';
import { Loader2, AlertCircle } from 'lucide-react';

interface VideoListProps {
  categoryId: string;
}

const VideoList: React.FC<VideoListProps> = ({ categoryId }) => {
  const { videos, loading, error } = useYouTubeVideos(categoryId);

  // 1. 로딩 상태 처리
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  // 2. 에러 상태 처리
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
        <p>영상을 불러오는 중 오류가 발생했습니다.</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  // 3. 영상이 없을 때 처리
  if (!videos || videos.length === 0) {
    return null; // 재생목록 ID가 없거나 영상이 없을 때는 렌더링하지 않습니다.
  }

  // 4. 영상 목록 렌더링
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">
        관련 영상
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex flex-col group">
            {/* 유튜브 영상 (16:9 비율 유지) */}
            <div className="w-full relative aspect-video bg-slate-900">
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full border-0"
              />
            </div>
            {/* 영상 제목 */}
            <div className="p-4 bg-white">
              <h4 className="font-semibold text-slate-800 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                {video.title}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoList;
