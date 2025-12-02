import VideoCard from "@/components/VideoCard/VideoCard";
import { ChannelItem, VideoItem } from "@/types";
import { getVideo } from "@/utils/apiService";
import { value_converter } from "@/utils/converters/value_converter";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ChannelPage = () => {
  const { channelId } = useLocalSearchParams() as { channelId?: string };

  const [channelInfo, setChannelInfo] = useState<ChannelItem | null>(null);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChannelVideos = async () => {
    if (!channelId) return;

    try {
      setLoading(true);

      // 1️⃣ Fetch channel info
      const channelRes = await getVideo(
        `/channels?part=snippet,brandingSettings,statistics,contentDetails&id=${channelId}`
      );

      if (channelRes.error) {
        setError(channelRes.error.message);
        return;
      }

      const channelData = channelRes.data?.items?.[0] as
        | ChannelItem
        | undefined;
      if (!channelData) {
        setError("Channel not found");
        return;
      }

      setChannelInfo(channelData);

      // 2️⃣ Get uploads playlist
      const uploadsPlaylistId =
        channelData.contentDetails.relatedPlaylists.uploads;
      if (!uploadsPlaylistId) {
        setError("Uploads playlist not found");
        return;
      }

      // 3️⃣ Fetch playlist items
      const playlistRes = await getVideo(
        `/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=20`
      );

      const playlistItems = playlistRes.data?.items || [];
      const videoIds = playlistItems
        .map((item) => item.contentDetails.videoId)
        .join(",");

      if (!videoIds) {
        setError("No videos found");
        return;
      }

      // 4️⃣ Fetch full video details
      const videosRes = await getVideo(
        `/videos?part=snippet,contentDetails,statistics&id=${videoIds}`
      );

      const validVideos = (videosRes.data?.items || []).filter(
        (video) => video.snippet
      );
      setVideos(validVideos);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelVideos();
  }, [channelId]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );

  if (error || !channelInfo)
    return (
      <View style={styles.center}>
        <Text>{error || "Channel not found"}</Text>
      </View>
    );

  const subscriberCount = value_converter(
    Number(channelInfo.statistics.subscriberCount || 0)
  );
  const videoCount = value_converter(
    Number(channelInfo.statistics.videoCount || 0)
  );

  const renderHeader = () => (
    <View>
      {channelInfo.brandingSettings?.image?.bannerExternalUrl && (
        <Image
          source={{ uri: channelInfo.brandingSettings.image.bannerExternalUrl }}
          style={styles.banner}
        />
      )}

      <View style={styles.channelHeader}>
        <Image
          source={{
            uri:
              channelInfo.snippet.thumbnails.high?.url ||
              channelInfo.snippet.thumbnails.default.url,
          }}
          style={styles.avatar}
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.channelTitle}>{channelInfo.snippet.title}</Text>
          {channelInfo.snippet.customUrl && (
            <Text style={styles.subText}>@{channelInfo.snippet.customUrl}</Text>
          )}
          <Text style={styles.subText}>
            {subscriberCount} subscribers • {videoCount} videos
          </Text>
          <Text style={styles.description}>
            {channelInfo.snippet.description}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.subscribeButton}>
        <Text style={styles.subscribeText}>Subscribe</Text>
      </TouchableOpacity>

      <View style={{ height: 20 }} />
    </View>
  );

  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <VideoCard item={item as any} />}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={<View style={{ height: 60 }} />}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ChannelPage;

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  banner: { width: "100%", height: 150, borderRadius: 8, marginBottom: 12 },
  channelHeader: {
    padding: 10,
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  avatar: { width: 150, height: 150, borderRadius: 75 },
  channelTitle: { fontSize: 22, fontWeight: "bold" },
  subText: { fontSize: 14, color: "gray", marginVertical: 2 },
  description: { fontSize: 14, marginTop: 4, marginRight: 10 },
  subscribeButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    borderRadius: 4,
    marginTop: 8,
    alignItems: "center",
    marginHorizontal: 10,
  },
  subscribeText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
