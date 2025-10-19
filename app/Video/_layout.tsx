import { Stack } from "expo-router";

export default function VideoLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,     // or false if you want full immersive
      }}
    />
  );
}
