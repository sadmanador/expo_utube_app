import React from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { value_converter } from "@/utils/value_converter";
import moment from "moment";

export interface RecommendedVideo {
  id: string;
  title: string;
  channelTitle: string;
  channelId: string; // needed for channel navigation
  thumbnail: string;
  viewCount?: number;
  publishedAt?: string;
}

interface RecommendedListProps {
  videos: RecommendedVideo[];
}

const RecommendedList: React.FC<RecommendedListProps> = ({ videos }) => {
  const router = useRouter();

  const renderItem = ({ item }: { item: RecommendedVideo }) => {
    const views = item.viewCount;
    console.log(item);

    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          router.push({ pathname: "/Video/[id]", params: { id: item.id } })
        }
      >
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />

        <View style={styles.metaInfoContainer}>
          {/* Channel avatar + navigation */}
          <View style={styles.metaRow}>
            <Pressable
              onPress={() => router.push(`/Channel/${item.channelId}`)}
            >
              <Image
                source={{
                  uri: `https://i.pravatar.cc/100?u=${item.channelId}`,
                }}
                style={styles.avatar}
              />
            </Pressable>

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
      </Pressable>
    );
  };

  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      scrollEnabled={false} // allow parent ScrollView to scroll
    />
  );
};

export default RecommendedList;

const styles = StyleSheet.create({
  card: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  thumbnail: { width: 120, height: 70, borderRadius: 6 },
  metaInfoContainer: { flex: 1 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  metaInfo: { flex: 1 },
  title: { fontSize: 14, fontWeight: "600" },
  subText: { fontSize: 12, color: "gray", marginTop: 2 },
});
