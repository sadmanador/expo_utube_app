import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { getVideo } from "@/utils/apiService";
import ShortsCard from "@/components/ShortsCard/ShortsCard";
import SafeAreaLayout from "@/components/SafeAreaLayout";

interface VideoItem {
  id: { videoId: string };
  snippet: any;
}

const Shorts = () => {
  const [shorts, setShorts] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchShorts = async () => {
    try {
      // Replace 'your_search_query' with what you want (or '' for trending)
      const res = await getVideo(
        `/search?part=snippet&q=&type=video&videoDuration=short&maxResults=20`
      );

      if (res.data?.items?.length) {
        setShorts(res.data.items);
      } else {
        setError("No shorts found");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch shorts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShorts();
  }, []);

  if (loading)
    return (
      <SafeAreaLayout>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaLayout>
    );

  if (error)
    return (
      <SafeAreaLayout>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>{error}</Text>
        </View>
      </SafeAreaLayout>
    );

  return (
    <SafeAreaLayout>
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        {shorts.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => router.push(`/video/${item.id.videoId}`)}
            style={{ marginBottom: 12 }}
          >
            <ShortsCard item={item} />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaLayout>
  );
};

export default Shorts;
