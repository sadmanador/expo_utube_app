// components/CommentsSection.tsx
import { useComments } from "@/hooks/useComments";
import { Comment, CommentsSectionProps } from "@/types";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

const CommentsSection: React.FC<CommentsSectionProps> = ({ videoId, userAvatar }) => {
  const { comments, loading } = useComments({ videoId });
  const [collapsed, setCollapsed] = useState(true);
  const [input, setInput] = useState("");

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

      {/* Collapse button */}
      {!collapsed && (
        <Pressable
          onPress={() => setCollapsed(true)}
          style={{
            alignSelf: "center",
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
              <View key={item.id} style={{ flexDirection: "row", marginBottom: 10 }}>
                <Image
                  source={{ uri: item.authorProfileImageUrl }}
                  style={{ width: 35, height: 35, borderRadius: 17.5, marginRight: 10 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "600" }}>{item.authorDisplayName}</Text>
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
