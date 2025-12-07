import React from "react";
import { View, FlatList, ActivityIndicator, Text } from "react-native";
import VideoCard from "@/components/VideoCard/VideoCard";
import { useInfiniteFetch } from "@/hooks/useFetch";
import StatusView from "@/components/StatusView/StatusView";

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

 if (isLoading || error) {
  return (
    <StatusView
      loading={isLoading}
      error={error ? "Error fetching videos" : undefined}
    />
  );
}


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
