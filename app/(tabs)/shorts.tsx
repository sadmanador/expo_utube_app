import ChannelAvatarButton from "@/components/ChannelAvatarButton/ChannelAvatarButton";
import { useYouTubeShortVideos } from "@/hooks/useYouTubeShortVideos";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const { width, height } = Dimensions.get("window");
const HISTORY_KEY = "VIDEO_HISTORY";
const MAX_HISTORY = 20;

const FullScreenVideoFeed: React.FC = () => {
  const playerRefs = useRef<any[]>([]);
  const [playingIndex, setPlayingIndex] = useState(0);

  // ✔ Fetch using custom hook
  const { videos, loading } = useYouTubeShortVideos("20", 20);

  const router = useRouter();

  // Store video to history when played
  const storeVideoHistory = async (videoId: string) => {
    try {
      const json = await AsyncStorage.getItem(HISTORY_KEY);
      const history: string[] = json ? JSON.parse(json) : [];

      const newHistory = [videoId, ...history.filter((id) => id !== videoId)];
      const trimmed = newHistory.slice(0, MAX_HISTORY);

      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    } catch (err) {
      console.error("Failed to update video history:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (videos.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No videos found.</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }: any) => (
    <View style={{ width, height }}>
      {/* Video Player */}
      {(() => {
        type InitialPlayerParams = {
          controls?: boolean;
          modestbranding?: boolean;
          rel?: boolean;
          showinfo?: boolean;
          [key: string]: unknown;
        };

        type YouTubeState =
          | "unstarted"
          | "ended"
          | "playing"
          | "paused"
          | "buffering"
          | "cued";

        type YoutubePlayerRef = React.ElementRef<typeof YoutubePlayer> | null;

        return (
          <YoutubePlayer
            ref={(ref: YoutubePlayerRef) => (playerRefs.current[index] = ref)}
            height={height * 0.25}
            width={width}
            videoId={item.id}
            play={playingIndex === index}
            mute={false}
            forceAndroidAutoplay
            initialPlayerParams={
              {
                controls: true,
                modestbranding: true,
                rel: false,
                showinfo: false,
              } as InitialPlayerParams
            }
            onChangeState={(state: YouTubeState) => {
              if (state === "playing") {
                storeVideoHistory(item.id);
              }
            }}
          />
        );
      })()}

      {/* Video Info */}
      <View style={styles.videoInfo}>
        <View style={styles.channelRow}>
          <ChannelAvatarButton
            channelId={item.channelId}
            uri={item.channelAvatar}
            size={50} // optional, default is 40
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.channel}>{item.channelTitle}</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={12}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={videos}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToInterval={height}
      decelerationRate="fast"
      onMomentumScrollEnd={(ev) =>
        setPlayingIndex(Math.round(ev.nativeEvent.contentOffset.y / height))
      }
      getItemLayout={(_, index) => ({
        length: height,
        offset: height * index,
        index,
      })}
    />
  );
};

export default FullScreenVideoFeed;

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  videoInfo: {
    paddingHorizontal: 10,
    paddingTop: 10,
    height: height * 0.35,
    backgroundColor: "#fff",
  },
  channelRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  title: { fontSize: 16, fontWeight: "bold" },
  channel: { fontSize: 14, color: "gray", marginTop: 2 },
  description: { fontSize: 14, color: "#333" },
});
