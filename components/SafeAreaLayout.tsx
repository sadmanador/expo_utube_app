// components/SafeAreaLayout.tsx
import { styles } from "@/Global_style/style";
import { SafeAreaLayoutProps } from "@/types";
import React from "react";
import { Platform, StatusBar, View,  } from "react-native";



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
