import VideoCard from "@/components/VideoCard/VideoCard";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useChannelData } from "@/hooks/useChannelData";
import { value_converter } from "@/utils/converters/value_converter";
import React from "react";

const ChannelPage = () => {
  const { channelId } = useLocalSearchParams();
  const id = Array.isArray(channelId) ? channelId[0] : channelId;
  const { channelInfo, videos, loading, error } = useChannelData(id);

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
    Number(channelInfo.statistics.subscriberCount)
  );

  const videoCount = value_converter(
    Number(channelInfo.statistics.videoCount)
  );

  const renderHeader = () => (
    <View>
      {!!channelInfo.brandingSettings?.image?.bannerExternalUrl && (
        <Image
          source={{ uri: channelInfo.brandingSettings.image.bannerExternalUrl }}
          style={styles.banner}
        />
      )}

      <View style={styles.channelHeader}>
        <Image
          source={{ uri: channelInfo.snippet.thumbnails?.high?.url }}
          style={styles.avatar}
        />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={styles.channelTitle}>{channelInfo.snippet.title}</Text>
          <Text style={styles.subText}>
            @{channelInfo.snippet.customUrl}
          </Text>
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
      contentContainerStyle={{ paddingBottom: 20 }}
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
