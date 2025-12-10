import { useEffect, useState } from "react";
import { ChannelItem, VideoItem } from "@/types";
import { getVideo } from "@/utils/apiService";

export const useChannelData = (channelId?: string) => {
  const [channelInfo, setChannelInfo] = useState<ChannelItem | null>(null);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChannelVideos = async () => {
    if (!channelId) return;

    try {
      setLoading(true);

      // Fetch channel info
      const channelRes = await getVideo(
        `/channels?part=snippet,brandingSettings,statistics,contentDetails&id=${channelId}`
      );
      const channelData = channelRes.data?.items?.[0];
      if (!channelData) {
        setError("Channel not found");
        return;
      }
      setChannelInfo(channelData);

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

      setVideos(videosRes.data?.items || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelVideos();
  }, [channelId]);

  return { channelInfo, videos, loading, error };
};
