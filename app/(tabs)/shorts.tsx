import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import YoutubePlayer, {
  InitialPlayerParams,
} from "react-native-youtube-iframe";
import ChannelAvatarButton from "@/components/ChannelAvatarButton/ChannelAvatarButton";
import { useYouTubeShortVideos } from "@/hooks/useYouTubeShortVideos";
import { YouTubeState } from "@/types";
import { useAddVideoToHistory } from "@/hooks/useAddVideoToHistory"; // ✅ Import the hook
import StatusView from "@/components/StatusView/StatusView";

const { width, height } = Dimensions.get("window");

// --------------------
// Component
// --------------------
const FullScreenVideoFeed: React.FC = () => {
  // Typed ref array for YoutubePlayer
  const playerRefs = useRef<(React.ElementRef<typeof YoutubePlayer> | null)[]>(
    []
  );
  const [playingIndex, setPlayingIndex] = useState(0);

  const { videos, loading } = useYouTubeShortVideos("20", 20);

  // ✅ Use the hook to add video to history
  const addVideoToHistory = useAddVideoToHistory();

  if (loading) {
    return <StatusView loading />;
  }

  if (!loading && videos.length === 0) {
    return <StatusView error="No videos found." />;
  }

  // --------------------
  // Render each video
  // --------------------
  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={{ width, height }}>
      {/* YouTube Player */}
      <YoutubePlayer
        ref={(ref: React.ElementRef<typeof YoutubePlayer> | null) => {
          playerRefs.current[index] = ref;
        }}
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
          if (state === "playing") addVideoToHistory(item.id); // ✅ use hook
        }}
      />

      {/* Video Info */}
      <View style={styles.videoInfo}>
        <View style={styles.channelRow}>
          <ChannelAvatarButton
            channelId={item.channelId}
            uri={item.channelAvatar}
            size={50}
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

// --------------------
// Styles
// --------------------
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
