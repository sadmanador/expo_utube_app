// components/ChannelAvatarButton.tsx
import React from "react";
import { Pressable, Image } from "react-native";
import { useRouter } from "expo-router";

interface ChannelAvatarButtonProps {
  channelId: string;   // required to build default route
  uri: string;         // avatar image URL
  size?: number;       // optional size, default 40
  to?: string;         // optional custom route
}

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
