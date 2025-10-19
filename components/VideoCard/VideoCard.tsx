import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import moment from "moment";
import { parseYouTubeDuration } from "@/utils/duration_converter";
import { value_converter } from "@/utils/value_converter";
import { VideoItem } from "@/types";

export interface VideoCardProps {
  item: VideoItem;
}

const VideoCard: React.FC<VideoCardProps> = ({ item }) => {
  const router = useRouter();

  const videoId = typeof item.id === "string" ? item.id : item.id.videoId;

  return (
    <View style={styles.card}>
      <Pressable onPress={() => router.push(`/Video/${videoId}`)}>
        <Image
          source={{ uri: item.snippet.thumbnails.medium.url }}
          style={styles.thumbnail}
        />
        <View style={styles.durationBox}>
          <Text style={styles.durationText}>
            {parseYouTubeDuration(item.contentDetails.duration)}
          </Text>
        </View>
      </Pressable>

      {/* Video Info */}
      <View style={styles.metaRow}>
        <Pressable onPress={() => router.push(`/Channel/${item.snippet.channelId}`)}>
          <Image
            source={{ uri: `https://i.pravatar.cc/100?u=${item.snippet.channelId}` }}
            style={styles.avatar}
          />
        </Pressable>

        <View style={styles.metaInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {item.snippet.title}
          </Text>
          <Text style={styles.subText}>
            {item.snippet.channelTitle} • {value_converter(Number(item.statistics.viewCount))} views •{" "}
            {moment(item.snippet.publishedAt).fromNow()}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default VideoCard;

const styles = StyleSheet.create({
  card: { marginBottom: 20 },
  thumbnail: { width: "100%", height: 200, borderRadius: 10 },
  durationBox: {
    position: "absolute",
    right: 8,
    bottom: 8,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  durationText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  metaRow: { flexDirection: "row", marginTop: 8, alignItems: "center" },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  metaInfo: { flex: 1 },
  title: { fontSize: 16, fontWeight: "bold", color: "#000" },
  subText: { fontSize: 13, color: "gray", marginTop: 2 },
});
