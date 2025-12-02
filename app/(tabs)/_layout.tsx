import Navbar from "@/components/Navbar/Navbar";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Home_Icon, Shorts_Icon, Subscriptions_Icon, You_Icon } from "@/utils/icons";

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Navbar />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "white",
          tabBarStyle: {
            backgroundColor: "rgba(16, 15, 15, 0.8)",
            position: "absolute",
            borderTopWidth: 0,
            elevation: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <Home_Icon color={color} />,
          }}
        />
        <Tabs.Screen
          name="shorts"
          options={{
            title: "Shorts",
            tabBarIcon: ({ color }) => <Shorts_Icon color={color} />,
          }}
        />
        <Tabs.Screen
          name="subscriptions"
          options={{
            title: "Subscriptions",
            tabBarIcon: ({ color }) => <Subscriptions_Icon color={color} />,
          }}
        />
        <Tabs.Screen
          name="you"
          options={{
            title: "You",
            tabBarIcon: ({ color }) => <You_Icon color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}
