import { useAsync } from "@/hooks/useAsync"; // our reusable wrapper
import { getVideo } from "@/utils/apiService";
import { useCallback } from "react";

export const useChannelData = (channelId?: string) => {
  const fetchChannelVideos = useCallback(async () => {
    if (!channelId) return null;

    // Fetch channel info
    const channelRes = await getVideo(
      `/channels?part=snippet,brandingSettings,statistics,contentDetails&id=${channelId}`
    );
    const channelData = channelRes.data?.items?.[0];
    if (!channelData) throw new Error("Channel not found");

    // Get uploads playlist
    const uploadsPlaylistId =
      channelData.contentDetails.relatedPlaylists.uploads;

    // Get playlist items
    const playlistRes = await getVideo(
      `/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=20`
    );

    const videoIds = playlistRes.data?.items
      ?.map((i: any) => i.contentDetails.videoId)
      .join(",");

    // Fetch video details
    const videosRes = await getVideo(
      `/videos?part=snippet,contentDetails,statistics&id=${videoIds}`
    );

    return {
      channelInfo: channelData,
      videos: videosRes.data?.items || [],
    };
  }, [channelId]);

  const { loading, error, data } = useAsync(fetchChannelVideos, [fetchChannelVideos]);

  return {
    loading,
    error,
    channelInfo: data?.channelInfo ?? null,
    videos: data?.videos ?? [],
  };
};
