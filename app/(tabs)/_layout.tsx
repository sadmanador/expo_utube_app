import { Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: "rgba(16, 15, 15, 0.8)", // semi-transparent gray
          position: "absolute", // optional (floating effect)
          borderTopWidth: 0, // removes the top border line
          elevation: 0, // removes Android shadow
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({color}) => <Entypo name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen name="shorts" options={{ title: "Shorts",
        tabBarIcon: ({color}) => <MaterialCommunityIcons name="cellphone-play" size={24} color={color} />,
       }} />
      <Tabs.Screen name="subscriptions" options={{ title: "Subscriptions",
        tabBarIcon: ({color}) => <MaterialIcons name="subscriptions" size={24} color={color} />,
       }} />
      <Tabs.Screen name="you" options={{ title: "You",
        tabBarIcon: ({color}) => <Entypo name="user" size={24} color={color} />,
       }} />
    </Tabs>
  );
}
