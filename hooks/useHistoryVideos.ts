import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getVideo } from "@/utils/apiService";
import { VideoItem } from "@/types";
import { HISTORY_KEY } from "@/constants/videoConfig";



export const useHistoryVideos = () => {
  const [historyVideos, setHistoryVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistoryVideos = async () => {
    setLoading(true);
    try {
      const json = await AsyncStorage.getItem(HISTORY_KEY);
      const videoIds: string[] = json ? JSON.parse(json) : [];

      if (!videoIds.length) {
        setHistoryVideos([]);
        return;
      }

      const res = await getVideo(
        `/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(",")}`
      );

      const items = (res.data as { items?: VideoItem[] }).items ?? [];

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

      setHistoryVideos(sorted);
    } catch (err) {
      console.error("Failed to fetch history videos:", err);
      setHistoryVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
      setHistoryVideos([]);
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistoryVideos();
    }, [])
  );

  return { historyVideos, loading, clearHistory };
};
