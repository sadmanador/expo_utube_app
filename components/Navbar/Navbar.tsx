import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { NavbarStyles } from "./navbarStyles";

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
    <View style={NavbarStyles.navbar}>
      <TouchableOpacity onPress={() => router.push("/")}>
        <Image
          source={require("../../assets/images/utube.png")}
          style={NavbarStyles.logo}
        />
      </TouchableOpacity>

      {searchOpen ? (
        <View style={NavbarStyles.searchContainer}>
          {/* Input field */}
          <TextInput
            ref={inputRef}
            style={NavbarStyles.searchInput}
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
