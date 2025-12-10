import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import VideoCard from "@/components/VideoCard/VideoCard";
import { useHistoryVideos } from "@/hooks/useHistoryVideos";
import { useRecommendedVideos } from "@/hooks/useRecommendedVideos";

const YouPage = () => {
  const { historyVideos, loading, clearHistory } = useHistoryVideos();

  const firstChannelId = historyVideos?.[0]?.channelId;
  const { videos: recommendedVideos } = useRecommendedVideos(firstChannelId);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (!historyVideos.length)
    return (
      <View style={styles.center}>
        <Text>No watch history yet.</Text>
      </View>
    );

  return (
    <View style={{ paddingVertical: 10 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>History</Text>
        <Pressable style={styles.clearButton} onPress={clearHistory}>
          <Text style={styles.clearButtonText}>Clear History</Text>
        </Pressable>
      </View>

      {/* History Videos */}
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
            <VideoCard item={item} />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />

      {/* Recommended Videos */}
      {recommendedVideos.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={[styles.sectionTitle, { marginLeft: 10 }]}>
            Recommended
          </Text>

          <FlatList
            horizontal
            data={recommendedVideos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <VideoCard item={item} />
              </View>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
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
