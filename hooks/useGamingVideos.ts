// hooks/useGamingVideos.ts
import { API_KEY } from "@/utils/apiService";
import { useState, useEffect } from "react";

export interface RecommendedVideo {
  id: string;
  title: string;
  channelTitle: string;
  channelId: string;
  thumbnail: string;
  viewCount?: number;
}

const MAX_RESULTS = 20;
const GAMING_CATEGORY_ID = "20"; // YouTube category ID for Gaming

export const useGamingVideos = () => {
  const [videos, setVideos] = useState<RecommendedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&videoCategoryId=${GAMING_CATEGORY_ID}&maxResults=${MAX_RESULTS}&regionCode=US&key=${API_KEY}`
        );
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);

        const mapped = data.items.map((item: any) => ({
          id: item.id,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          channelId: item.snippet.channelId,
          thumbnail: item.snippet.thumbnails.medium.url,
          viewCount: item.statistics?.viewCount,
        }));

        setVideos(mapped);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return { videos, loading, error };
};
