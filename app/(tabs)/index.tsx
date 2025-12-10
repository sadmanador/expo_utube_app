import StatusView from "@/components/StatusView/StatusView";
import VideoCard from "@/components/VideoCard/VideoCard";
import { useInfiniteVideos } from "@/hooks/useFetch";
import React from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

export default function Home() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteVideos({
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


  const videos = data?.pages.flatMap((page) => page.items) || [];

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
