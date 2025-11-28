import { API_KEY } from "@/utils/apiService";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";

interface Comment {
  id: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  textOriginal: string;
  publishedAt: string;
  replies?: Comment[];
}

interface Props {
  videoId: string;
  userAvatar: string;
}



const CommentsSection: React.FC<Props> = ({ videoId, userAvatar }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&maxResults=50&videoId=${videoId}&key=${API_KEY}`
        );
        const data = await res.json();

        if (data.error) throw new Error(data.error.message);

        const mapped: Comment[] = (data.items || []).map((item: any) => {
          const top = item.snippet.topLevelComment.snippet;
          const replies =
            item.replies?.comments?.map((r: any) => {
              const rs = r.snippet;
              return {
                id: r.id,
                authorDisplayName: rs.authorDisplayName || "Unknown",
                authorProfileImageUrl: rs.authorProfileImageUrl || "",
                textOriginal: rs.textOriginal || "",
                publishedAt: rs.publishedAt || "",
              };
            }) || [];

          return {
            id: item.id,
            authorDisplayName: top.authorDisplayName || "Unknown",
            authorProfileImageUrl: top.authorProfileImageUrl || "",
            textOriginal: top.textOriginal || "",
            publishedAt: top.publishedAt || "",
            replies,
          };
        });

        setComments(mapped);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [videoId]);

  const renderReply = (reply: Comment) => (
    <View
      key={reply.id}
      style={{ flexDirection: "row", marginBottom: 6, marginLeft: 40 }}
    >
      <Image
        source={{ uri: reply.authorProfileImageUrl }}
        style={{ width: 28, height: 28, borderRadius: 14, marginRight: 8 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "600" }}>{reply.authorDisplayName}</Text>
        <Text>{reply.textOriginal}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ marginTop: 10 }}>
      {/* Input bar */}
      <Pressable
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
        onPress={() => setCollapsed(false)}
      >
        <Image
          source={{ uri: userAvatar }}
          style={{ width: 35, height: 35, borderRadius: 17.5, marginRight: 10 }}
        />
        <TextInput
          placeholder="Add a comment"
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
          value={input}
          onFocus={() => setCollapsed(false)}
          onChangeText={setInput}
        />
      </Pressable>

      {/* Collapse button - horizontally centered */}
      {!collapsed && (
        <Pressable
          onPress={() => setCollapsed(true)}
          style={{
            alignSelf: "center", // horizontally center
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: "#eee",
            borderRadius: 20,
            marginBottom: 10,
          }}
        >
          <Text style={{ color: "#333" }}>Collapse Comments</Text>
        </Pressable>
      )}

      {/* Comments list */}
      {!collapsed && (
        <ScrollView style={{ maxHeight: 400 }}>
          {loading ? (
            <ActivityIndicator />
          ) : comments.length === 0 ? (
            <Text style={{ color: "gray", marginVertical: 10 }}>
              No comments yet.
            </Text>
          ) : (
            comments.map((item) => (
              <View
                key={item.id}
                style={{ flexDirection: "row", marginBottom: 10 }}
              >
                <Image
                  source={{ uri: item.authorProfileImageUrl }}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 17.5,
                    marginRight: 10,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "600" }}>
                    {item.authorDisplayName}
                  </Text>
                  <Text>{item.textOriginal}</Text>
                  {item.replies?.map(renderReply)}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default CommentsSection;
