import React, { useRef, useState } from "react";
import { View, FlatList, Dimensions, Text } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const { width, height } = Dimensions.get("window");

interface VideoItem {
  id: string;
  title: string;
  channelTitle: string;
}

interface Props {
  videos: VideoItem[];
}

const FullScreenVideoFeed: React.FC<Props> = ({ videos }) => {
  const playerRefs = useRef<any[]>([]);
  const [playingIndex, setPlayingIndex] = useState(0);

  const renderItem = ({ item, index }: { item: VideoItem; index: number }) => (
    <View style={{ width, height }}>
      <YoutubePlayer
      ref={(ref: React.ElementRef<typeof YoutubePlayer> | null) =>
        (playerRefs.current[index] = ref)
      }
      height={height}
      width={width}
      videoId={item.id}
      play={playingIndex === index}
      mute={false}
      forceAndroidAutoplay={true}
      initialPlayerParams={{
        controls: true,
        modestbranding: true,
        rel: false,
        showinfo: false,
      } as Record<string, unknown>}
      />

      <View
      style={{
        position: "absolute",
        bottom: 60,
        left: 10,
        right: 10,
      }}
      >
      <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
        {item.title}
      </Text>
      <Text style={{ fontSize: 14, color: "#fff", marginTop: 4 }}>
        {item.channelTitle}
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
      snapToInterval={height} // ensure snap per full-screen item
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
