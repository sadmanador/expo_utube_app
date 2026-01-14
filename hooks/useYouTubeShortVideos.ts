import { CHANNEL_AVATAR } from "@/constants/api";
import { useAsync } from "@/hooks/useAsync";
import { ShortVideo, YouTubeShortVideoItem } from "@/types";
import { getVideo } from "@/utils/apiService";
import { useCallback } from "react";

export const useYouTubeShortVideos = (categoryId: string, maxResults: number) => {
  const fetchVideos = useCallback(async (): Promise<ShortVideo[]> => {
    const endpoint = `videos?part=snippet&chart=mostPopular&videoCategoryId=${categoryId}&maxResults=${maxResults}&regionCode=US`;

    const response = await getVideo(endpoint, categoryId);

    if (response.error) {
      throw new Error(response.error.message || "API error");
    }

    const data = response.data;
    if (!data?.items?.length) return [];

    const items = data.items as YouTubeShortVideoItem[];
    const mapped: ShortVideo[] = items.map((item) => ({
      id: typeof item.id === "string" ? item.id : item.id,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle ?? "",
      channelId: item.snippet.channelId ?? "",
      channelAvatar: `${CHANNEL_AVATAR}${item.snippet.channelId ?? ""}`,
      description: item.snippet.description ?? "",
    }));

    return mapped;
  }, [categoryId, maxResults]);

  const { loading, error, data: videos, execute: refetch } = useAsync(fetchVideos, [fetchVideos]);

  return { loading, error, videos: videos || [], refetch };
};
