// components/SafeAreaLayout.tsx
import { styles } from "@/Global_style/style";
import React from "react";
import { Platform, StatusBar, StyleProp, View, ViewStyle } from "react-native";

interface SafeAreaLayoutProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function SafeAreaLayout({
  children,
  style,
}: SafeAreaLayoutProps) {
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        },
      ]}
    >
      {children}
    </View>
  );
}
