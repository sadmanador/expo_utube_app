
import SafeAreaLayout from "@/components/SafeAreaLayout/SafeAreaLayout";
import { styles } from "@/Global_style/style";
import React from "react";
import { Text, View } from "react-native";

const subscriptions = () => {
  return (
    <SafeAreaLayout>
      <View style={styles.container}>
        <Text>Subscriptions Content</Text>
      </View>
    </SafeAreaLayout>
  );
};

export default subscriptions;
