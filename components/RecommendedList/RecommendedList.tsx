import { CHANNEL_AVATAR } from "@/constants/api";
import { RecommendedListProps, RecommendedVideo } from "@/types";

import { value_converter } from "@/utils/converters/value_converter";
import { useRouter } from "expo-router";
import moment from "moment";
import React from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import ChannelAvatarButton from "../ChannelAvatarButton/ChannelAvatarButton";
import { RecommendedListStyles } from "./RecommendedListStyles";

const RecommendedList: React.FC<RecommendedListProps> = ({ videos }) => {
  const router = useRouter();

  const renderItem = ({ item }: { item: RecommendedVideo }) => {
    const views = item.viewCount;

    return (
      <View style={RecommendedListStyles.card}>
        {/* BIG THUMBNAIL */}
        <Pressable
          onPress={() =>
            router.push({ pathname: "/Video/[id]", params: { id: item.id } })
          }
        >
          <Image
            source={{ uri: item.thumbnail }}
            style={RecommendedListStyles.thumbnail}
          />
        </Pressable>

        {/* VIDEO INFO ROW */}
        <View style={RecommendedListStyles.metaRow}>
          {/* CHANNEL AVATAR */}

          <ChannelAvatarButton
            channelId={item.channelId}
            uri={`${CHANNEL_AVATAR}${item.channelId}`}
            size={40} // optional, default is 40
          />

          {/* TEXT INFO */}
          <View style={RecommendedListStyles.metaInfo}>
            <Text style={RecommendedListStyles.title} numberOfLines={2}>
              {item.title}
            </Text>

            <Text style={RecommendedListStyles.subText}>
              {item.channelTitle}{" "}
              {views ? `• ${value_converter(views)} views` : ""}{" "}
              {item.publishedAt
                ? `• ${moment(item.publishedAt).fromNow()}`
                : ""}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
      scrollEnabled={false}
    />
  );
};

export default RecommendedList;
