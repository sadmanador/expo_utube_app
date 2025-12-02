import { CHANNEL_AVATAR } from "@/constants/api";
import { RecommendedListProps, VideoItem } from "@/types";

import { value_converter } from "@/utils/value_converter";
import { useRouter } from "expo-router";
import moment from "moment";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";



const RecommendedList: React.FC<RecommendedListProps> = ({ videos }) => {
  const router = useRouter();

  const renderItem = ({ item }: { item: VideoItem }) => {
    const views = item.viewCount;


    return (
      <View style={styles.card}>
        {/* BIG THUMBNAIL */}
        <Pressable
          onPress={() =>
            router.push({ pathname: "/Video/[id]", params: { id: item.id } })
          }
        >
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        </Pressable>

        {/* VIDEO INFO ROW */}
        <View style={styles.metaRow}>
          {/* CHANNEL AVATAR */}
          <Pressable onPress={() => router.push(`/Channel/${item.channelId}`)}>
            <Image
              source={{
                uri: `${CHANNEL_AVATAR}${item.channelId}`,
              }}
              style={styles.avatar}
            />
          </Pressable>

          {/* TEXT INFO */}
          <View style={styles.metaInfo}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>

            <Text style={styles.subText}>
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

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
  },

  // BIG thumbnail
  thumbnail: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  metaInfo: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
  },

  subText: {
    fontSize: 12,
    color: "gray",
    marginTop: 3,
  },
});
