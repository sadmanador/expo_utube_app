import ChannelAvatarButton from "@/components/ChannelAvatarButton/ChannelAvatarButton";
import CommentsSection from "@/components/CommentsSection/CommentsSection";
import RecommendedList from "@/components/RecommendedList/RecommendedList";
import { CHANNEL_AVATAR } from "@/constants/api";
import { useFetch } from "@/hooks/useFetch";
import { useGamingVideos } from "@/hooks/useGamingVideos";
import { VideoItem } from "@/types";

import { parseYouTubeDuration } from "@/utils/converters/duration_converter";
import { value_converter } from "@/utils/converters/value_converter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const { width } = Dimensions.get("window");
const PLAYER_HEIGHT = 230;
const HISTORY_KEY = "VIDEO_HISTORY";
const MAX_HISTORY = 20;

// ----------------------
// YouTube API response type
// ----------------------
interface YouTubeVideoItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    channelId: string;
    channelTitle: string;
    publishedAt: string;
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
  };
  contentDetails?: {
    duration?: string;
  };
}

const VideoPage = () => {
  const { videos } = useGamingVideos();
  const { id } = useLocalSearchParams() as { id?: string };

  // ✅ Explicitly type the useFetch with YouTubeVideoItem
  const { data, isLoading, error } = useFetch<YouTubeVideoItem>("videos", {
    part: "snippet,contentDetails,statistics",
    id,
  });

  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const MAX_LINES = 3;

  const playerRef = useRef<typeof YoutubePlayer>(null);

  // ----------------------
  // Autoplay shortly after mount
  // ----------------------
  useEffect(() => {
    const timer = setTimeout(() => setPlaying(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // ----------------------
  // Pause/resume on navigation
  // ----------------------
  useFocusEffect(
    useCallback(() => {
      setPlaying(true);
      return () => setPlaying(false);
    }, [])
  );

  // ----------------------
  // Update video history
  // ----------------------
  useEffect(() => {
    const addToHistory = async (videoId: string) => {
      try {
        const json = await AsyncStorage.getItem(HISTORY_KEY);
        const history: string[] = json ? JSON.parse(json) : [];

        const newHistory = [videoId, ...history.filter((id) => id !== videoId)];
        const trimmed = newHistory.slice(0, MAX_HISTORY);

        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
        console.log("Added to history:", trimmed);
      } catch (err) {
        console.error("Failed to update video history:", err);
      }
    };

    if (!isLoading && data?.items?.length) {
      addToHistory(data.items[0].id);
    }
  }, [isLoading, data]);

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

  // ----------------------
  // Map API response to VideoItem
  // ----------------------
  const apiItem = data.items[0];

  // ✅ Create a properly typed video object
  const video: VideoItem = {
    id: apiItem.id,
    title: apiItem.snippet.title,
    description: apiItem.snippet.description,
    channelTitle: apiItem.snippet.channelTitle,
    channelAvatar: `${CHANNEL_AVATAR}${apiItem.snippet.channelId}`,
    channelId: apiItem.snippet.channelId,
    publishedAt: apiItem.snippet.publishedAt,
    viewCount: Number(apiItem.statistics?.viewCount ?? 0),
    duration: apiItem.contentDetails?.duration ?? "PT0M0S",
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

      <ScrollView style={styles.scrollContent}>
        <View style={styles.metaContainer}>
          <Text style={styles.title}>{video.title}</Text>

          <View style={styles.row}>
            <ChannelAvatarButton
              channelId={video.channelId}
              uri={video.channelAvatar}
              size={50} // optional, default is 40
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
          <CommentsSection
            videoId={video.id}
            userAvatar={video.channelAvatar}
          />
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
