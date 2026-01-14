// components/ChannelAvatarButton.tsx
import { ChannelAvatarButtonProps } from "@/types";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable } from "react-native";

const ChannelAvatarButton: React.FC<ChannelAvatarButtonProps> = ({
  channelId,
  uri,
  size = 40,
}) => {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push(`/Channel/${channelId}`)}>
      <Image
        source={{ uri }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2, 
          marginRight: 10
        }}
      />
    </Pressable>
  );
};

export default ChannelAvatarButton;
