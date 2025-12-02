// hooks/useGamingVideos.ts
import { useState, useEffect } from "react";
import { RecommendedVideo, ApiResponse } from "@/types";
import { getVideo } from "@/utils/apiService";


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

        // Use your api service
        const response: ApiResponse<any> = await getVideo(
          `videos?part=snippet,statistics&chart=mostPopular&videoCategoryId=${GAMING_CATEGORY_ID}&maxResults=${MAX_RESULTS}&regionCode=US`
        );



        if (response.error) throw new Error(response.error.message);

        const items = response.data?.items || [];

        const mapped: RecommendedVideo[] = items.map((item: any) => ({
          id: item.id,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          channelId: item.snippet.channelId,
          thumbnail: item.snippet.thumbnails.medium.url,
          viewCount: item.statistics?.viewCount,
          publishedAt: item.snippet.publishedAt,
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
