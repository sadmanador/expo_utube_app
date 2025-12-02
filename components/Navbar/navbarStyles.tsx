import { StyleSheet } from "react-native";

// components/navbarStyles.ts
export const NavbarStyles = StyleSheet.create({
  navbar: {
    height: 60,
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  logo: {
    width: 100,
    height: 30,
    resizeMode: "contain",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    paddingHorizontal: 6,
  },
  searchInput: {
    flex: 1,
    color: "#000",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});