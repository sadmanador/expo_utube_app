import React from "react";
import { View, Text, ScrollView, Image, Pressable, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

// Fake static data
const videos = [
  {
    id: "1",
    title: "Amazing React Native Tutorial",
    channel: "Code Academy",
    views: 12345,
    publishedAt: "2025-10-01T12:00:00Z",
    thumbnail: "https://unsplash.com/photos/cozy-seating-area-with-chairs-and-a-plant-by-window-aIiL6tT_mWM", // placeholder
    duration: "PT12M45S",
  },
  {
    id: "2",
    title: "Top 10 Tech Gadgets 2025",
    channel: "TechWorld",
    views: 98765,
    publishedAt: "2025-09-20T08:30:00Z",
    thumbnail: "https://placeimg.com/640/360/tech?2", // another placeholder
    duration: "PT8M32S",
  },
  {
    id: "3",
    title: "Learn JavaScript in 1 Hour",
    channel: "DevSimplified",
    views: 54321,
    publishedAt: "2025-10-05T15:00:00Z",
    thumbnail: "https://placeimg.com/640/360/tech?3", // another placeholder
    duration: "PT1H0M0S",
  },
];


const parseYouTubeDuration = (duration: string) => {
  // Fake converter for static demo
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = match?.[1] ? match[1].replace("H", "") : "0";
  const minutes = match?.[2] ? match[2].replace("M", "0") : "0";
  const seconds = match?.[3] ? match[3].replace("S", "0") : "0";
  if (hours !== "0") return `${hours}:${minutes}:${seconds}`;
  return `${minutes}:${seconds}`;
};

const FakeYouTubeHome = () => {
  const screenWidth = Dimensions.get("window").width;
  const thumbnailHeight = screenWidth * 0.56; // 16:9 ratio

  return (
    <ScrollView style={styles.container}>
      {videos.map((video) => (
        <Pressable key={video.id} style={styles.card} onPress={() => alert(`Go to video ${video.id}`)}>
          <View style={styles.thumbnailWrapper}>
            <Image source={{ uri: video.thumbnail }} style={[styles.thumbnail, { height: thumbnailHeight }]} />
            <View style={styles.durationWrapper}>
              <Text style={styles.durationText}>{parseYouTubeDuration(video.duration)}</Text>
            </View>
          </View>
          <View style={styles.infoContainer}>
            <Ionicons name="person-circle" size={40} color="gray" style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title} numberOfLines={2}>{video.title}</Text>
              <Text style={styles.channel}>{video.channel}</Text>
              <Text style={styles.meta}>{`${video.views.toLocaleString()} views • ${moment(video.publishedAt).fromNow()}`}</Text>
            </View>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default FakeYouTubeHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  card: {
    marginBottom: 20,
  },
  thumbnailWrapper: {
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    borderRadius: 8,
  },
  durationWrapper: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
  },
  channel: {
    fontSize: 12,
    color: "gray",
  },
  meta: {
    fontSize: 12,
    color: "gray",
  },
});

