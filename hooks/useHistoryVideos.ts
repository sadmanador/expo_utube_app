import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getVideo } from "@/utils/apiService";
import { VideoItem } from "@/types";
import { HISTORY_KEY } from "@/constants/videoConfig";
import { useAsync } from "@/hooks/useAsync";

export const useHistoryVideos = () => {
  const fetchHistoryVideos = useCallback(async () => {
    const json = await AsyncStorage.getItem(HISTORY_KEY);
    const videoIds: string[] = json ? JSON.parse(json) : [];

    if (!videoIds.length) return [];

    const res = await getVideo(
      `/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(",")}`
    );

    const items: VideoItem[] = (res.data as { items?: VideoItem[] }).items ?? [];

    // Sort videos to match the history order
    const sorted: VideoItem[] = videoIds
      .map((id) =>
        items.find((v) =>
          typeof v.id === "string"
            ? v.id === id
            : v.id &&
              typeof v.id === "object" &&
              "videoId" in v.id &&
              (v.id as { videoId: string }).videoId === id
        )
      )
      .filter((v): v is VideoItem => v !== undefined);

    return sorted;
  }, []);

  // useAsync handles loading, error, and data
  const { loading, error, data: historyVideos, execute: refetch } = useAsync(fetchHistoryVideos, [fetchHistoryVideos]);

  // Clear history function remains the same
  const clearHistory = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
      refetch(); // optional: reload after clearing
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  }, [refetch]);

  // Automatically refetch when screen is focused
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return { historyVideos: historyVideos || [], loading, error, clearHistory };
};
