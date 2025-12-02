import { useEffect, useState } from "react";

import { CHANNEL_AVATAR } from "@/constants/api";
import { ShortVideo } from "@/types/index";
import { getVideo } from "@/utils/apiService";

export const useYouTubeShortVideos = (
  categoryId: string,
  maxResults: number
) => {
  const [videos, setVideos] = useState<ShortVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    try {
      setLoading(true);

      const endpoint = `videos?part=snippet&chart=mostPopular&videoCategoryId=${categoryId}&maxResults=${maxResults}&regionCode=US`;

      const response = await getVideo(
        endpoint,
        categoryId
      );

      if (response.error) {
        console.error("API error:", response.error);
        setVideos([]);
        return;
      }

      const data = response.data;

      if (data && data.items.length > 0) {
        const mapped = data.items.map((item) => ({
          id: typeof item.id === "string" ? item.id : item.id.videoId,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          channelId: item.snippet.channelId,
          channelAvatar: `${CHANNEL_AVATAR}${item.snippet.channelId}`,
          description: item.snippet.description,
        }));

        setVideos(mapped);
      } else {
        setVideos([]);
      }
    } catch (err) {
      console.error("Failed to fetch YouTube videos:", err);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [categoryId, maxResults]);

  return { videos, loading, refetch: fetchVideos };
};
