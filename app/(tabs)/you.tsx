import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import VideoCard from "@/components/VideoCard/VideoCard";
import { getVideo } from "@/utils/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VideoItem } from "@/types";
import { useFocusEffect } from "@react-navigation/native";

const HISTORY_KEY = "VIDEO_HISTORY";

const YouPage = () => {
  const [historyVideos, setHistoryVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistoryVideos = async () => {
    setLoading(true);
    try {
      const json = await AsyncStorage.getItem(HISTORY_KEY);
      const videoIds: string[] = json ? JSON.parse(json) : [];

      if (videoIds.length === 0) {
        setHistoryVideos([]);
        return;
      }

      const res = await getVideo(
        `/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(",")}`
      );

      const items = (res.data as { items?: VideoItem[] }).items ?? [];

      if (items.length) {
        const sorted: VideoItem[] = videoIds
          .map((id) =>
            items.find((v) =>
              typeof v.id === "string"
                ? v.id === id
                : v.id && typeof v.id === "object" && "videoId" in v.id && (v.id as { videoId: string }).videoId === id
            )
          )
          .filter((v): v is VideoItem => v !== undefined);

        setHistoryVideos(sorted);
      } else {
        setHistoryVideos([]);
      }
    } catch (err) {
      console.error("Failed to fetch history videos:", err);
      setHistoryVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // Refresh history whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchHistoryVideos();
    }, [])
  );

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
      setHistoryVideos([]);
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (historyVideos.length === 0)
    return (
      <View style={styles.center}>
        <Text>No watch history yet.</Text>
      </View>
    );

  return (
    <View style={{ paddingVertical: 10 }}>
      {/* Header with Clear Button */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>History</Text>
        <Pressable style={styles.clearButton} onPress={clearHistory}>
          <Text style={styles.clearButtonText}>Clear History</Text>
        </Pressable>
      </View>

      <FlatList
        horizontal
        data={historyVideos}
        keyExtractor={(item) => {
          if (typeof item.id === "string") return item.id;
          if (item.id && typeof item.id === "object" && "videoId" in item.id)
            return (item.id as { videoId: string }).videoId;
          return "";
        }}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <VideoCard item={item as any} />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default YouPage;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  clearButton: {
    backgroundColor: "#e53935",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  cardWrapper: {
    borderRadius: 8,
    overflow: "hidden",
    transform: [{ scale: 0.85 }],
    marginHorizontal: 5,
  },
});
