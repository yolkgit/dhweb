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
        
        // rss2json 대신 allorigins 프록시를 통해 RSS XML 원본을 그대로 가져옵니다.
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`);
        
        if (!response.ok) {
          throw new Error('데이터를 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        const xmlText = data.contents;
        
        if (!xmlText) {
          throw new Error('RSS 데이터를 가져오는데 실패했습니다.');
        }

        // 브라우저 내장 DOMParser를 사용하여 XML 문자열을 분석합니다.
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        // <entry> 태그들을 순회하며 영상 정보를 추출합니다.
        const entries = Array.from(xmlDoc.querySelectorAll('entry'));
        
        // 추출한 데이터를 YouTubeVideo 인터페이스 형식에 맞게 변환합니다.
        const parsedVideos: YouTubeVideo[] = entries.map((entry) => {
          const id = entry.querySelector('id')?.textContent || '';
          const title = entry.querySelector('title')?.textContent || '';
          const link = entry.querySelector('link')?.getAttribute('href') || '';
          
          // 정규식을 사용해 YouTube 영상 ID 추출 (예: /v=([^&]+)/)
          const match = link.match(/v=([^&]+)/);
          const youtubeId = match ? match[1] : '';

          return {
            id: id || youtubeId,
            title: title,
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
