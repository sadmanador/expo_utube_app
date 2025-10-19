import React from "react";
import { View, Image, Text, StyleSheet, Dimensions } from "react-native";
import { VideoItem } from "@/types";

interface ShortsCardProps {
  item: VideoItem;
}

const ShortsCard: React.FC<ShortsCardProps> = ({ item }) => {
  const screenWidth = Dimensions.get("window").width;
  const thumbHeight = screenWidth * 0.56; // typical 16:9 ratio

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: item.snippet.thumbnails.high.url }}
        style={[styles.thumbnail, { height: thumbHeight }]}
        resizeMode="cover"
      />
      <Text style={styles.title} numberOfLines={2}>
        {item.snippet.title}
      </Text>
      <Text style={styles.channel}>{item.snippet.channelTitle}</Text>
    </View>
  );
};

export default ShortsCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  thumbnail: {
    width: "100%",
    borderRadius: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
    paddingHorizontal: 4,
  },
  channel: {
    fontSize: 12,
    color: "gray",
    paddingHorizontal: 4,
    marginBottom: 4,
  },
});
