import { CHANNEL_AVATAR } from "@/constants/api";
import { VideoCardItemProps } from "@/types";
import { parseYouTubeDuration } from "@/utils/converters/duration_converter";
import { value_converter } from "@/utils/converters/value_converter";
import { useRouter } from "expo-router";
import moment from "moment";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import ChannelAvatarButton from "../ChannelAvatarButton/ChannelAvatarButton";
import { VideoCardStyles } from "./VideoCardStyles";

const VideoCard: React.FC<VideoCardItemProps> = ({ item }) => {
  const router = useRouter();

  const videoId = typeof item.id === "string" ? item.id : item.id.videoId;
  const duration = item.contentDetails?.duration || ""; // use only contentDetails.duration
  const views = item.statistics?.viewCount
    ? value_converter(Number(item.statistics.viewCount))
    : "";

  return (
    <View style={VideoCardStyles.card}>
      <Pressable onPress={() => router.push(`/Video/${videoId}`)}>
        <Image
          source={{
            uri:
              item.snippet.thumbnails?.medium?.url ||
              item.snippet.thumbnails?.high?.url ||
              item.snippet.thumbnails?.default?.url ||
              "https://via.placeholder.com/480x360?text=No+Thumbnail",
          }}
          style={VideoCardStyles.thumbnail}
        />

        {duration ? (
          <View style={VideoCardStyles.durationBox}>
            <Text style={VideoCardStyles.durationText}>
              {parseYouTubeDuration(duration)}
            </Text>
          </View>
        ) : null}
      </Pressable>

      {/* Video Info */}
      <View style={VideoCardStyles.metaRow}>
        <ChannelAvatarButton
          channelId={item.snippet.channelId ?? ""}
          uri={`${CHANNEL_AVATAR}${item.snippet.channelId ?? ""}`}
          size={40}
        />

        <View style={VideoCardStyles.metaInfo}>
          <Text style={VideoCardStyles.title} numberOfLines={2}>
            {item.snippet.title}
          </Text>
          <Text style={VideoCardStyles.subText}>
            {item.snippet.channelTitle} {views ? `• ${views} views` : ""} •{" "}
            {moment(item.snippet.publishedAt).fromNow()}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default VideoCard;
