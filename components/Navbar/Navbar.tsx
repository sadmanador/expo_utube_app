import { Entypo } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<TextInput>(null);
  const router = useRouter();

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <View style={styles.navbar}>
      <Image
        source={require("../../assets/images/utube.png")}
        style={styles.logo}
      />

      {searchOpen ? (
        <View style={styles.searchContainer}>
          {/* Input field */}
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="rgba(0,0,0,0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={() => {
              if (searchQuery.trim()) {
                router.push(`/Search/${searchQuery.trim()}`);
                setSearchQuery(""); // ✅ clear input
                setSearchOpen(false); // ✅ close input
                inputRef.current?.blur(); // ✅ remove focus
              }
            }}
          />

          {/* Close button on RIGHT */}
          <TouchableOpacity onPress={() => setSearchOpen(false)}>
            <Entypo name="cross" size={32} color="#333" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setSearchOpen(true)}>
          <Entypo name="magnifying-glass" size={32} color="#333" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
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
