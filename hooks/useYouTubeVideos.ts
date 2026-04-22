import { useState, useEffect } from 'react';
import { DEFAULT_PLAYLISTS } from '../constants';

export interface YouTubeVideo {
  id: string;
  title: string;
  youtubeId: string;
}

export const useYouTubeVideos = (categoryId: string) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        // constants.ts에 정의된 DEFAULT_PLAYLISTS에서 categoryId에 해당하는 재생목록 ID를 가져옵니다.
        const playlistId = DEFAULT_PLAYLISTS[categoryId as keyof typeof DEFAULT_PLAYLISTS];
        
        // 재생목록 ID가 없는 카테고리는 처리하지 않습니다.
        if (!playlistId) {
          setVideos([]);
          setLoading(false);
          return;
        }

        // 유튜브 RSS 피드 주소
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;
        // rss2json API를 사용하여 XML을 JSON으로 변환합니다. (API 키 불필요)
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        
        if (!response.ok) {
          throw new Error('데이터를 불러오는데 실패했습니다.');
        }

        const data = await response.json();

        if (data.status !== 'ok') {
          throw new Error('RSS 변환에 실패했습니다.');
        }

        // 받아온 데이터를 YouTubeVideo 인터페이스에 맞게 파싱합니다.
        const parsedVideos: YouTubeVideo[] = data.items.map((item: any) => {
          // item.link 형식: "https://www.youtube.com/watch?v=VIDEO_ID"
          let youtubeId = '';
          try {
            const url = new URL(item.link);
            youtubeId = url.searchParams.get('v') || '';
          } catch (e) {
            youtubeId = item.link.split('v=')[1]?.split('&')[0] || '';
          }

          return {
            id: item.guid || item.id || youtubeId,
            title: item.title,
            youtubeId: youtubeId,
          };
        });

        setVideos(parsedVideos);
      } catch (err: any) {
        setError(err.message || '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [categoryId]);

  return { videos, loading, error };
};
