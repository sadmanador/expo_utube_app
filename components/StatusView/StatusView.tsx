import { StatusViewProps } from "@/types";
import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

const StatusView: React.FC<StatusViewProps> = ({ loading, error, style }) => {
  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return null;
};

export default StatusView;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 16 },
});
