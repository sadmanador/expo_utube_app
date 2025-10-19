import React from "react";
import { View, FlatList, ActivityIndicator, Text } from "react-native";
import VideoCard from "@/components/VideoCard/VideoCard";
import { useInfiniteFetch } from "@/hooks/useFetch";

export default function Home() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteFetch<any>("videos", {
    part: "snippet,contentDetails,statistics",
    chart: "mostPopular",
    maxResults: 5,
    regionCode: "US",
  });

  if (isLoading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );

  if (error)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error fetching videos</Text>
      </View>
    );

  const videos = data?.pages.flatMap((page: any) => page.items) || [];

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
      <FlatList
        data={videos}
        keyExtractor={(item) =>
          typeof item.id === "string" ? item.id : item.id.videoId
        }
        renderItem={({ item }) => <VideoCard item={item} />}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
      />
    </View>
  );
}
