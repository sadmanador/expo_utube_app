import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import moment from "moment";

import ChannelAvatarButton from "@/components/ChannelAvatarButton/ChannelAvatarButton";
import CommentsSection from "@/components/CommentsSection/CommentsSection";
import RecommendedList from "@/components/RecommendedList/RecommendedList";
import { CHANNEL_AVATAR } from "@/constants/api";
import { useFetch } from "@/hooks/useFetch";
import { useRecommendedVideos } from "@/hooks/useRecommendedVideos";
import { VideoItem, YouTubeVideoItem } from "@/types";
import { parseYouTubeDuration } from "@/utils/converters/duration_converter";
import { value_converter } from "@/utils/converters/value_converter";
import { PLAYER_HEIGHT } from "@/constants/videoConfig";
import StatusView from "@/components/StatusView/StatusView";
import { useAddVideoToHistory } from "@/hooks/useAddVideoToHistory"; // ✅ import hook

const { width } = Dimensions.get("window");

const VideoPage = () => {
  const { id } = useLocalSearchParams() as { id?: string };

  // Fetch current video data
  const { data, isLoading, error } = useFetch<YouTubeVideoItem>("videos", {
    part: "snippet,contentDetails,statistics",
    id,
  });

  // Only fetch recommended videos after we have channelId
  const channelId = data?.items?.[0]?.snippet.channelId;
  const { videos: recommendedVideos } = useRecommendedVideos(channelId);

  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const MAX_LINES = 3;

  const playerRef = useRef<typeof YoutubePlayer>(null);

  // Hook for adding video to history
  const addVideoToHistory = useAddVideoToHistory();

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
    if (!isLoading && data?.items?.length) {
      const apiItem = data.items[0];
      const videoId =
        typeof apiItem.id === "string" ? apiItem.id : apiItem.id.videoId;

      addVideoToHistory(videoId); // ✅ use hook
    }
  }, [isLoading, data, addVideoToHistory]);

  if (isLoading || error || !data?.items?.length) {
    return (
      <StatusView
        loading={isLoading}
        error={error ? "Error loading video" : undefined}
      />
    );
  }

  const apiItem = data.items[0];
  const videoId =
    typeof apiItem.id === "string" ? apiItem.id : apiItem.id.videoId;

  // Map API response to VideoItem
  const video: VideoItem = {
    id: videoId,
    title: apiItem.snippet.title,
    description: apiItem.snippet.description ?? "",
    channelTitle: apiItem.snippet.channelTitle ?? "",
    channelId: apiItem.snippet.channelId ?? "",
    channelAvatar: `${CHANNEL_AVATAR}${apiItem.snippet.channelId}`,
    publishedAt: apiItem.snippet.publishedAt ?? "",
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
              size={50}
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
          <RecommendedList videos={recommendedVideos} />
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
