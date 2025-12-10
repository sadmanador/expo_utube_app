import { CHANNEL_AVATAR } from "@/constants/api";
import { VideoCardProps, VideoCardItemProps, VideoItem } from "@/types";
import { parseYouTubeDuration } from "@/utils/converters/duration_converter";
import { value_converter } from "@/utils/converters/value_converter";
import { useRouter } from "expo-router";
import moment from "moment";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import ChannelAvatarButton from "../ChannelAvatarButton/ChannelAvatarButton";
import { VideoCardStyles } from "./VideoCardStyles";

const VideoCard: React.FC<VideoCardProps> = ({ item }) => {
  const router = useRouter();

  // Detect which item type this is
  const isUI = !("snippet" in item);

  if (isUI) {
    /** -------------------- UI MODE (VideoItem) -------------------- **/
    const video = item as VideoItem;

    return (
      <View style={VideoCardStyles.card}>
        <Pressable onPress={() => router.push(`/Video/${video.id}`)}>
          <Image
            source={{ uri: video.thumbnail }}
            style={VideoCardStyles.thumbnail}
          />

          {video.duration ? (
            <View style={VideoCardStyles.durationBox}>
              <Text style={VideoCardStyles.durationText}>
                {video.duration}
              </Text>
            </View>
          ) : null}
        </Pressable>

        <View style={VideoCardStyles.metaRow}>
          <ChannelAvatarButton
            channelId={video.channelId}
            uri={video.channelAvatar}
            size={40}
          />

          <View style={VideoCardStyles.metaInfo}>
            <Text style={VideoCardStyles.title} numberOfLines={2}>
              {video.title}
            </Text>
            <Text style={VideoCardStyles.subText}>
              {video.channelTitle} • {value_converter(Number(video.viewCount))} views •{" "}
              {moment(video.publishedAt).fromNow()}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  /** -------------------- RAW YOUTUBE API MODE -------------------- **/
  const api = item as VideoCardItemProps["item"];

  const videoId = typeof api.id === "string" ? api.id : api.id.videoId;
  const duration = api.contentDetails?.duration || "";
  const views = api.statistics?.viewCount
    ? value_converter(Number(api.statistics.viewCount))
    : "";

  return (
    <View style={VideoCardStyles.card}>
      <Pressable onPress={() => router.push(`/Video/${videoId}`)}>
        <Image
          source={{
            uri:
              api.snippet.thumbnails?.medium?.url ||
              api.snippet.thumbnails?.high?.url ||
              api.snippet.thumbnails?.default?.url ||
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

      <View style={VideoCardStyles.metaRow}>
        <ChannelAvatarButton
          channelId={api.snippet.channelId ?? ""}
          uri={`${CHANNEL_AVATAR}${api.snippet.channelId ?? ""}`}
          size={40}
        />

        <View style={VideoCardStyles.metaInfo}>
          <Text style={VideoCardStyles.title} numberOfLines={2}>
            {api.snippet.title}
          </Text>
          <Text style={VideoCardStyles.subText}>
            {api.snippet.channelTitle} {views ? `• ${views} views` : ""} •{" "}
            {moment(api.snippet.publishedAt).fromNow()}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default VideoCard;
