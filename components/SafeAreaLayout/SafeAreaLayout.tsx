// components/SafeAreaLayout.tsx
import { GlobalStyles } from "@/Global_style/GlobalStyle";
import { SafeAreaLayoutProps } from "@/types";
import React from "react";
import { Platform, StatusBar, View } from "react-native";

export default function SafeAreaLayout({
  children,
  style,
}: SafeAreaLayoutProps) {
  return (
    <View
      style={[
        GlobalStyles.container,
        {
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        },
      ]}
    >
      {children}
    </View>
  );
}
