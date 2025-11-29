import React, { useRef, useState, useEffect } from "react";
import { View, FlatList, Dimensions, Text, ActivityIndicator, StyleSheet } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { API_KEY } from "@/utils/apiService";

const { width, height } = Dimensions.get("window");

interface VideoItem {
  id: string;
  title: string;
  channelTitle: string;
}

const FullScreenVideoFeed: React.FC = () => {
  const playerRefs = useRef<any[]>([]);
  const [playingIndex, setPlayingIndex] = useState(0);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch YouTube Gaming videos
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
      <YoutubePlayer
        ref={(ref: React.ElementRef<typeof YoutubePlayer> | null) => (playerRefs.current[index] = ref)}
        height={height}
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
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.channel}>{item.channelTitle}</Text>
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
  overlay: { position: "absolute", bottom: 60, left: 10, right: 10 },
  title: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  channel: { fontSize: 14, color: "#fff", marginTop: 4 },
});
