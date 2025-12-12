import { getVideo } from "@/utils/apiService";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, Text, View } from "react-native";

import StatusView from "@/components/StatusView/StatusView";
import VideoCard from "@/components/VideoCard/VideoCard";
import { YouTubeVideoItemForSearch } from "@/types";
import { useAsync } from "@/hooks/useAsync";

const SearchResults = () => {
  const { searchQuery } = useLocalSearchParams() as { searchQuery?: string };

  // useAsync handles loading, error, and data
  const {
    loading,
    error,
    data: videos,
  } = useAsync<YouTubeVideoItemForSearch[]>(async () => {
    if (!searchQuery) return [];

    const res = await getVideo(
      `/search?part=snippet&type=video&maxResults=20&q=${searchQuery}`
    );

    if (res.error) throw new Error(res.error.message);
    if (!res.data?.items?.length) throw new Error("No results found.");

    return res.data.items;
  }, [searchQuery]);

  // Show status
  if (loading) return <StatusView loading style={{ marginTop: 50 }} />;
  if (error) return <StatusView error={error} style={{ marginTop: 50 }} />;

  // Render list
  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Search Results for: {searchQuery}
      </Text>

      <FlatList
        data={videos}
        keyExtractor={(item) =>
          typeof item.id === "string" ? item.id : item.id.videoId
        }
        renderItem={({ item }) => <VideoCard item={item} />}
      />
    </View>
  );
};

export default SearchResults;
