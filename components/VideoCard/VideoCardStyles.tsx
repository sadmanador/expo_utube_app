import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  thumbnailContainer: {
    position: "relative",
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnail: {
    width: "100%",
    height: 200,
  },
  duration: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(27,27,27,0.9)",
    color: "#fff",
    fontWeight: "600",
    paddingHorizontal: 4,
    borderRadius: 4,
    fontSize: 12,
  },
  infoContainer: {
    flexDirection: "row",
    padding: 8,
    alignItems: "flex-start",
    gap: 8,
  },
  iconWrapper: {
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
    flexShrink: 1,
  },
  channelTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "gray",
    marginBottom: 2,
  },
  meta: {
    fontSize: 12,
    color: "gray",
  },
});
