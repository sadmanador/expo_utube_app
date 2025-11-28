import { useFetch } from "@/hooks/useFetch";
import { parseYouTubeDuration } from "@/utils/duration_converter";
import { value_converter } from "@/utils/value_converter";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import YoutubePlayer from "react-native-youtube-iframe";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Home from "../(tabs)";
import { useGamingVideos } from "@/hooks/useGamingVideos";
import RecommendedList from "@/components/RecommendedList/RecommendedList";

const { width } = Dimensions.get("window");
const PLAYER_HEIGHT = 230;
const HISTORY_KEY = "VIDEO_HISTORY";
const MAX_HISTORY = 20;

export interface VideoDetails {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  channelAvatar: string;
  publishedAt: string;
  viewCount: number;
  duration: string;
}

const VideoPage = () => {
  const { videos, loading } = useGamingVideos();
  const { id } = useLocalSearchParams() as { id?: string };
  const { data, isLoading, error } = useFetch<any>("videos", {
    part: "snippet,contentDetails,statistics",
    id,
  });

  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const MAX_LINES = 3;

  const playerRef = useRef<typeof YoutubePlayer>(null);

  // Autoplay shortly after mount
  useEffect(() => {
    const timer = setTimeout(() => setPlaying(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Pause/resume on navigation
  useFocusEffect(
    useCallback(() => {
      setPlaying(true);
      return () => setPlaying(false);
    }, [])
  );

  // Update video history
  useEffect(() => {
    const addToHistory = async (videoId: string) => {
      try {
        const json = await AsyncStorage.getItem(HISTORY_KEY);
        const history: string[] = json ? JSON.parse(json) : [];

        // Add current video to front, remove duplicates
        const newHistory = [videoId, ...history.filter((id) => id !== videoId)];

        // Keep only last MAX_HISTORY items
        const trimmed = newHistory.slice(0, MAX_HISTORY);

        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
      } catch (err) {
        console.error("Failed to update video history:", err);
      }
    };

    if (id) addToHistory(id);
  }, [id]);

  if (isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (error || !data?.items?.length)
    return (
      <View style={styles.center}>
        <Text>Error loading video</Text>
      </View>
    );

  const item = data.items[0];
  const video: VideoDetails = {
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    channelTitle: item.snippet.channelTitle,
    channelAvatar: `https://i.pravatar.cc/100?u=${item.snippet.channelId}`,
    publishedAt: item.snippet.publishedAt,
    viewCount: Number(item.statistics?.viewCount ?? 0),
    duration: item.contentDetails?.duration ?? "PT0M0S",
  };

  return (
    <View style={styles.container}>
      <YoutubePlayer
        ref={playerRef}
        height={PLAYER_HEIGHT}
        width={width}
        play={playing}
        videoId={video.id}
        mute={false}
        forceAndroidAutoplay
        initialPlayerParams={{
          controls: true,
          modestbranding: true,
          rel: false,
          showinfo: false,
        }}
      />

      {/* Scrollable content */}
      <ScrollView style={styles.scrollContent}>
        <View style={styles.metaContainer}>
          <Text style={styles.title}>{video.title}</Text>

          <View style={styles.row}>
            <Image
              source={{ uri: video.channelAvatar }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.channelName}>{video.channelTitle}</Text>
              <Text style={styles.subText}>
                {value_converter(video.viewCount)} views •{" "}
                {moment(video.publishedAt).fromNow()} •{" "}
                {parseYouTubeDuration(video.duration)}
              </Text>
            </View>
          </View>

          <Text
            style={styles.description}
            numberOfLines={expanded ? undefined : MAX_LINES}
          >
            {video.description}
          </Text>

          {video.description.length > 120 && (
            <Text
              style={styles.moreButton}
              onPress={() => setExpanded(!expanded)}
            >
              {expanded ? "Show less" : "...more"}
            </Text>
          )}
        </View>

        <View style={{ padding: 10 }}>
          <RecommendedList videos={videos} />
        </View>
      </ScrollView>
    </View>
  );
};

export default VideoPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  webview: { width: "100%", height: "100%" },
  scrollContent: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  metaContainer: { padding: 10 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  channelName: { fontSize: 14, fontWeight: "600" },
  subText: { fontSize: 12, color: "gray", marginTop: 2 },
  description: { fontSize: 14, color: "#333" },
  moreButton: { fontSize: 14, fontWeight: "600", marginTop: 4 },
});
