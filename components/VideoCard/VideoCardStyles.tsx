import { StyleSheet } from "react-native";

export const VideoCardStyles = StyleSheet.create({
  card: { marginBottom: 20 },
  thumbnail: { width: "100%", height: 200 },
  durationBox: {
    position: "absolute",
    right: 8,
    bottom: 8,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  durationText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  metaRow: { flexDirection: "row", marginTop: 8, alignItems: "center" },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  metaInfo: { flex: 1 },
  title: { fontSize: 16, fontWeight: "bold", color: "#000" },
  subText: { fontSize: 13, color: "gray", marginTop: 2 },
});