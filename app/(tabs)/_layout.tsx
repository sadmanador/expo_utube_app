import React, { useState, useRef, useEffect } from "react";
import { View, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Navbar from "@/components/Navbar/Navbar";

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
            tabBarIcon: ({ color }) => <Entypo name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="shorts"
          options={{
            title: "Shorts",
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cellphone-play" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="subscriptions"
          options={{
            title: "Subscriptions",
            tabBarIcon: ({ color }) => <MaterialIcons name="subscriptions" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="you"
          options={{
            title: "You",
            tabBarIcon: ({ color }) => <Entypo name="user" size={24} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}


