import { StyleSheet } from "react-native";


export const RecommendedListStyles = StyleSheet.create({
  card: {
    flexDirection: "column",
  },

  // BIG thumbnail
  thumbnail: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  metaInfo: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
  },

  subText: {
    fontSize: 12,
    color: "gray",
    marginTop: 3,
  },
});