import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ColorValue } from "react-native";

// Each icon is exported as a function component accepting a `color` prop
export const Home_Icon = ({ color }: { color: ColorValue }) => (
  <Entypo name="home" size={24} color={color} />
);

export const Shorts_Icon = ({ color }: { color: ColorValue }) => (
  <MaterialCommunityIcons name="cellphone-play" size={24} color={color} />
);

export const Subscriptions_Icon = ({ color }: { color: ColorValue }) => (
  <MaterialIcons name="subscriptions" size={24} color={color} />
);

export const You_Icon = ({ color }: { color: ColorValue }) => (
  <Entypo name="user" size={24} color={color} />
);
