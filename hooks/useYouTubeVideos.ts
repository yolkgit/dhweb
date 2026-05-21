import { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';

export interface YouTubeVideo {
  id: string;
  title: string;
  youtubeId: string;
}

export const useYouTubeVideos = (categoryId: string) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { playlists, appSettings } = useContent();

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = appSettings.youtubeApiKey;
        const playlistId = playlists[categoryId]?.trim();

        // API 키 또는 재생목록 ID가 없으면 처리하지 않습니다.
        if (!apiKey || !playlistId || (!playlistId.startsWith('PL') && !playlistId.startsWith('UU'))) {
          setVideos([]);
          setLoading(false);
          return;
        }

        // YouTube Data API v3 직접 호출
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=15&playlistId=${playlistId}&key=${apiKey}`
        );

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData?.error?.message || '영상 데이터를 불러오는데 실패했습니다.');
        }

        const data = await response.json();

        const parsedVideos: YouTubeVideo[] = (data.items || [])
          .filter((item: any) => item.snippet?.resourceId?.videoId)
          .map((item: any) => ({
            id: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            youtubeId: item.snippet.resourceId.videoId,
          }));

        setVideos(parsedVideos);
      } catch (err: any) {
        setError(err.message || '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [categoryId, playlists, appSettings.youtubeApiKey]);

  return { videos, loading, error };
};
