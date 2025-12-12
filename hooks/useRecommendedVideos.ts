import { useCallback } from "react";
import { RecommendedVideo, YouTubeVideoItem, ApiResponse } from "@/types";
import { getVideo } from "@/utils/apiService";
import { useAsync } from "@/hooks/useAsync";

const MAX_RESULTS = 20;

export const useRecommendedVideos = (channelId?: string) => {
  const fetchRecommendedVideos = useCallback(async (): Promise<RecommendedVideo[]> => {
    if (!channelId) return [];

    // Step 1: Fetch most recent videos from the channel
    const searchResponse: ApiResponse<YouTubeVideoItem> = await getVideo(
      `search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=${MAX_RESULTS}`
    );
    if (searchResponse.error) throw new Error(searchResponse.error.message);

    const searchItems = searchResponse.data?.items || [];
    if (!searchItems.length) return [];

    // Step 2: Get statistics and contentDetails for these videos
    const ids = searchItems
      .map((item: any) => (typeof item.id === "string" ? item.id : item.id.videoId))
      .filter(Boolean)
      .join(",");

    const detailsResponse: ApiResponse<YouTubeVideoItem> = await getVideo(
      `videos?part=snippet,statistics,contentDetails&id=${ids}`
    );
    if (detailsResponse.error) throw new Error(detailsResponse.error.message);

    const detailsItems = detailsResponse.data?.items || [];

    // Step 3: Map to RecommendedVideo
    const mapped: RecommendedVideo[] = detailsItems.map((item) => ({
      id: typeof item.id === "string" ? item.id : item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle ?? "",
      channelId: item.snippet.channelId ?? "",
      thumbnail: item.snippet.thumbnails?.medium?.url || "",
      publishedAt: item.snippet.publishedAt ?? "",
      viewCount: item.statistics?.viewCount
        ? Number(item.statistics.viewCount)
        : undefined,
    }));

    return mapped;
  }, [channelId]);

  const { loading, error, data: videos } = useAsync(fetchRecommendedVideos, [fetchRecommendedVideos]);

  return { loading, error, videos: videos || [] };
};
