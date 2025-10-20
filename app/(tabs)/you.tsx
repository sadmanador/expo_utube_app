import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import VideoCard from "@/components/VideoCard/VideoCard";
import { getVideo } from "@/utils/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VideoItem } from "@/types";

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

      // Fetch video details for all videoIds
      const res = await getVideo(
        `/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(
          ","
        )}`
      );

      if (res.data?.items?.length) {
        // Sort to match history order (newest first) and filter undefined
        const sorted: VideoItem[] = videoIds
          .map((id) =>
            res.data!.items.find((v) =>
              typeof v.id === "string" ? v.id === id : v.id.videoId === id
            )
          )
          .filter((v): v is VideoItem => v !== undefined); // filter out undefined

        setHistoryVideos(sorted);
      } else {
        setHistoryVideos([]);
      }
    } catch (err) {
      console.error("Failed to fetch history videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryVideos();
  }, []);

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
      <Text style={styles.sectionTitle}>History</Text>
      <FlatList
        horizontal
        data={historyVideos}
        keyExtractor={(item) =>
          typeof item.id === "string" ? item.id : item.id.videoId
        }
        renderItem={({ item }) => (
          <View
            style={{
              borderRadius: 8,
              overflow: "hidden",
              transform: [{ scale: 0.85 }], // scales both width and height
            }}
          >
            <VideoCard item={item} />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default YouPage;

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    marginLeft: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
