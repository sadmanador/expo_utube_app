import React, { useState, useRef, useEffect } from "react";
import { View, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabsLayout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <View style={{ flex: 1 }}>
      {/* Top Navbar */}
      <View style={styles.navbar}>
        <Image source={require("../../assets/images/utube.png")} style={styles.logo} />

        {searchOpen && (
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onBlur={() => setSearchOpen(false)}
          />
        )}

        <TouchableOpacity onPress={() => setSearchOpen(true)} style={{ marginLeft: 10 }}>
          <Entypo name="magnifying-glass" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
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

const styles = StyleSheet.create({
  navbar: {
    height: 60,
   
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  logo: {
    width: 100,
    height: 30,
    resizeMode: "contain",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#222",
    color: "white",
    borderRadius: 6,
  },
});
