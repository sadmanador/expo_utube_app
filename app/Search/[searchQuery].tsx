import { getVideo } from "@/utils/apiService";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";

import { VideoItem } from "@/types";
import VideoCard from "@/components/VideoCard/VideoCard";

const SearchResults = () => {
  const { searchQuery } = useLocalSearchParams() as { searchQuery?: string };
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSearchResults = async () => {
    try {
      const res = await getVideo(
        `/search?part=snippet&type=video&maxResults=20&q=${searchQuery}`
      );

      if (res.error) {
        setError(res.error.message);
      } else if (res.data?.items) {
        setVideos(res.data.items as VideoItem[]);
      } else {
        setError("No results found.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      setLoading(true);
      fetchSearchResults();
    }
  }, [searchQuery]);

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  if (error)
    return <Text style={{ marginTop: 50, color: "red" }}>{error}</Text>;

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
