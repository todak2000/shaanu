import React, { useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { handleSearch } from "../../app/db/apis";
import { useStore } from "../../app/store";
import { Item2Props } from "../../app/db/apis";

const SearchBar = ({
  setSearchArr,
  searchText,
  setSearchText,
}: {
  setSearchArr: React.Dispatch<React.SetStateAction<Item2Props[] | null>>;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { setLoading, theme, refreshing } = useStore();

  useEffect(() => {
    if (searchText == "") {
      setSearchArr(null);
    }
  }, [searchText]);

  useEffect(() => {
    if (refreshing) {
      setSearchText("");
    }
  }, [refreshing]);

  const updateSearch = async (text: string) => {
    setSearchText(text);
    setLoading(true);
    await handleSearch(text).then((result: any) => {
      setLoading(false);
      setSearchArr(result?.searchResultArray);
    });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#232323" : "#E5E5E5" },
      ]}
    >
      <Ionicons name="search" size={20} color="gray" />
      <TextInput
        style={[styles.input, { color: theme === "dark" ? "#ccc" : "#232323" }]}
        value={searchText}
        onChangeText={updateSearch}
        placeholder="Search by Item e.g. Rice"
        placeholderTextColor={theme === "dark" ? "#ffffff30" : "gray"}
        clearButtonMode="while-editing"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    marginLeft: 10,
    flex: 1,
    fontFamily: "MuseoRegular",
  },
});

export default SearchBar;
