import { StyleSheet, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { Text, View } from "../../components/Themed";
import { useStore } from "../store";
import Header from "../../components/Home/Header";
import SearchBar from "../../components/Home/Search";
import Loader from "../../components/Loader";
import Categories, { categoryProps }  from "../../components/Home/Category";
import GridList from "../../components/Home/GridList";
import {
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { fetchInventoryData } from "../db/apis";

function HomeScreen() {
  const {
    theme,
    inventoryDispatch,
    inventoryState,
    fetchInventoryDataCallBack
  } = useStore();

  const [selectedCategory, setSelectedCategory] =
    useState<categoryProps | null>(null);
  const [type, setType] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");
 
  useEffect(() => {
    if (selectedCategory === null) {
      fetchInventoryDataCallBack()
    } else {
      const data: any = {
        oldData: inventoryState.inventory,
        category: selectedCategory.category
      }
      fetchInventoryData(data)(inventoryDispatch)
    }
  }, [selectedCategory]);


  return (
    <View style={styles.container}>
      <Header />
      <SearchBar
        fetchData={fetchInventoryDataCallBack}
        searchText={searchText}
        setSearchText={setSearchText}
      />

      <Categories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      {inventoryState?.loading ? (
        null // <Loader />
      ) : (
        <View style={styles.lowerSection}>
          <Text style={styles.title}>
            {" "}
            {type === 0
              ? `${
                  typeof selectedCategory?.category === "string"
                    ? selectedCategory?.category
                    : ""
                } Donations close to you `
              : searchText !== ""
              ? "Search result"
              : "All Donations close to you "}
          </Text>
          {inventoryState.inventory?.length > 0 ? (
            <GridList
              data={inventoryState.inventory}
              lastDoc={inventoryState.oldInventory}
              fetchData={fetchInventoryData}
            />
          ) : (
            <View style={styles.noResult}>
              <MaterialIcons name="search-off" size={100} color="#ccc" />
              {type === 0 ? (
                <Text
                  style={[
                    styles.noResultText,
                    { color: theme === "dark" ? "#ccc" : "#232323" },
                  ]}
                >
                  Oops! there are no{" "}
                  {typeof selectedCategory?.category === "string"
                    ? `${selectedCategory?.category} Donations close to you currently`
                    : "Donations close to you currently"}
                </Text>
              ) : (
                <Text
                  style={[
                    styles.noResultText,
                    { color: theme === "dark" ? "#ccc" : "#232323" },
                  ]}
                >
                  Oops! your search yield no result
                </Text>
              )}
              <Pressable style={styles.refresh} onPress={fetchInventoryDataCallBack}>
                <MaterialCommunityIcons
                  name="database-refresh"
                  size={20}
                  color="black"
                />
                <Text style={styles.noResultText}>Refresh</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "15%",
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  title: {
    fontSize: 18,
    fontFamily: "MuseoBold",
    marginBottom: 10,
    marginTop: 10,
  },
  lowerSection: {
    backgroundColor: "transparent",
    flex: 1,
  },
  noResult: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginTop: 40,
  },
  noResultText: {
    fontFamily: "MuseoRegular",
    fontSize: 14,
    marginLeft: 10,
    textAlign: "center",
    color: "#232323",
  },
  refresh: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#ccc",
    borderRadius: 3,
    padding: 10,
  },
});
