import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HISTORY_KEY, MAX_HISTORY } from "@/constants/videoConfig";



export const useAddVideoToHistory = () => {
  /**
   * Add a video ID to history in AsyncStorage
   */
  const addVideoToHistory = useCallback(async (videoId: string) => {
    try {
      const json = await AsyncStorage.getItem(HISTORY_KEY);
      const history: string[] = json ? JSON.parse(json) : [];

      // Remove duplicate & add to front
      const newHistory = [videoId, ...history.filter((id) => id !== videoId)];

      // Limit history size
      const trimmed = newHistory.slice(0, MAX_HISTORY);

      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    } catch (err) {
      console.error("Failed to add video to history:", err);
    }
  }, []);

  return addVideoToHistory;
};
