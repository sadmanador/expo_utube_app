import React from "react";
import { View, Text, Pressable, Image, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { value_converter } from "@/utils/value_converter";

export interface RecommendedVideo {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  viewCount?: number;
}

interface RecommendedListProps {
  videos: RecommendedVideo[];
}

const RecommendedList: React.FC<RecommendedListProps> = ({ videos }) => {
  const router = useRouter();

  const renderItem = ({ item }: { item: RecommendedVideo }) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push({ pathname: "/Video/[id]", params: { id: item.id } })}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.subtitle}>
          {item.channelTitle} {item.viewCount ? `• ${value_converter(item.viewCount)} views` : ""}
        </Text>
      </View>
    </Pressable>
  );

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
  card: { flexDirection: "row", gap: 10, alignItems: "center" },
  thumbnail: { width: 120, height: 70, borderRadius: 6 },
  title: { fontSize: 14, fontWeight: "600" },
  subtitle: { fontSize: 12, color: "gray", marginTop: 2 },
});
