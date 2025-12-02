import SafeAreaLayout from "@/components/SafeAreaLayout/SafeAreaLayout";
import { GlobalStyles } from "@/Global_style/GlobalStyle";
import React from "react";
import { Text, View } from "react-native";

const subscriptions = () => {
  return (
    <SafeAreaLayout>
      <View style={GlobalStyles.container}>
        <Text>Subscriptions Content</Text>
      </View>
    </SafeAreaLayout>
  );
};

export default subscriptions;
