import React, { useRef, useState, useEffect } from "react";
import {
  View,
  FlatList,
  Dimensions,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_KEY } from "@/utils/apiService";

const { width, height } = Dimensions.get("window");
const HISTORY_KEY = "VIDEO_HISTORY";
const MAX_HISTORY = 20;

interface VideoItem {
  id: string;
  title: string;
  channelTitle: string;
  channelId: string;
  channelAvatar: string;
  description: string;
}

const FullScreenVideoFeed: React.FC = () => {
  const playerRefs = useRef<any[]>([]);
  const [playingIndex, setPlayingIndex] = useState(0);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&videoCategoryId=20&maxResults=20&regionCode=US&key=${API_KEY}`
      );
      const data = await res.json();

      if (data.items?.length) {
        const mapped: VideoItem[] = data.items.map((item: any) => ({
          id: item.id,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          channelId: item.snippet.channelId,
          channelAvatar: `https://i.pravatar.cc/100?u=${item.snippet.channelId}`,
          description: item.snippet.description,
        }));
        setVideos(mapped);
      } else {
        setVideos([]);
      }
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

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

  const renderItem = ({ item, index }: { item: VideoItem; index: number }) => (
    <View style={{ width, height }}>
      {/* Video Player */}
      <YoutubePlayer
        ref={(ref: React.ElementRef<typeof YoutubePlayer> | null) =>
          (playerRefs.current[index] = ref)
        }
        height={height * 0.25}
        width={width}
        videoId={item.id}
        play={playingIndex === index}
        mute={false}
        forceAndroidAutoplay
        initialPlayerParams={{
          controls: true,
          modestbranding: true,
          rel: false,
          showinfo: false,
        } as Record<string, unknown>}
        onChangeState={(state) => {
          if (state === "playing") {
            storeVideoHistory(item.id); // store in history
          }
        }}
      />

      {/* Video Info Below */}
      <View style={styles.videoInfo}>
        <View style={styles.channelRow}>
          <Pressable onPress={() => router.push(`/Channel/${item.channelId}`)}>
            <Image source={{ uri: item.channelAvatar }} style={styles.avatar} />
          </Pressable>
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
      onMomentumScrollEnd={(ev) => {
        const index = Math.round(ev.nativeEvent.contentOffset.y / height);
        setPlayingIndex(index);
      }}
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
