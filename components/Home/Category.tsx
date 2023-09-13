import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { primaryYellow } from "../../constants/Colors";
import { useStore } from "../../app/store";
import * as Crypto from "expo-crypto";
import {
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    overflow: "hidden",
    height: 80,
    marginBottom: 20,
  },
  item: {
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    width: 80,
  },
  activeItem: {
    backgroundColor: primaryYellow,
  },
  text: {
    fontFamily: "MuseoRegular",
    fontSize: 11,
  },
  activeText: {
    color: "#fff",
  },
  mainText: {
    fontFamily: "MuseoBold",
    fontSize: 18,
    marginBottom: 10,
  },
});
export type categoryProps = {
  id: string;
  icon: any;
  iconActive: any;
  category: string | null;
};

export type dataProps = {
  selectedCategory: categoryProps | null;
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<categoryProps | null>
  >;
};
const Categories = ({
  setSelectedCategory,
  selectedCategory,
}: dataProps) => {
  const { theme, setLoading } = useStore();

  const handleSelect = (item: categoryProps) => {
    setLoading(true);
    setSelectedCategory(item);
  };

  const data: categoryProps[] = [
    {
      id: Crypto.randomUUID(),
      category: null,
      icon: (
        <AntDesign
          name="CodeSandbox"
          size={24}
          color={theme === "dark" ? primaryYellow : "#232323"}
        />
      ),
      iconActive: (
        <AntDesign
          name="CodeSandbox"
          size={24}
          color={theme === "dark" ? "#000" : "#232323"}
        />
      ),
    },
    {
      id: Crypto.randomUUID(),
      category: "Food",
      icon: (
        <MaterialCommunityIcons
          name="food-turkey"
          size={24}
          color={theme === "dark" ? primaryYellow : "#232323"}
        />
      ),
      iconActive: (
        <MaterialCommunityIcons
          name="food-turkey"
          size={24}
          color={theme === "dark" ? "#000" : "#232323"}
        />
      ),
    },
    {
      id: Crypto.randomUUID(),
      category: "Utensils",
      icon: (
        <FontAwesome5
          name="utensils"
          size={24}
          color={theme === "dark" ? primaryYellow : "#232323"}
        />
      ),
      iconActive: (
        <FontAwesome5
          name="utensils"
          size={24}
          color={theme === "dark" ? "#000" : "#232323"}
        />
      ),
    },
    {
      id: Crypto.randomUUID(),
      category: "Wears",
      icon: (
        <Ionicons
          name="ios-watch"
          size={24}
          color={theme === "dark" ? primaryYellow : "#232323"}
        />
      ),
      iconActive: (
        <Ionicons
          name="ios-watch"
          size={24}
          color={theme === "dark" ? "#000" : "#232323"}
        />
      ),
    },
    {
      id: Crypto.randomUUID(),
      category: "Cash",
      icon: (
        <MaterialCommunityIcons
          name="piggy-bank-outline"
          size={24}
          color={theme === "dark" ? primaryYellow : "#232323"}
        />
      ),
      iconActive: (
        <MaterialCommunityIcons
          name="piggy-bank-outline"
          size={24}
          color={theme === "dark" ? "#000" : "#232323"}
        />
      ),
    },
    {
      id: Crypto.randomUUID(),
      category: "Gadgets",
      icon: (
        <MaterialCommunityIcons
          name="monitor-cellphone"
          size={24}
          color={theme === "dark" ? primaryYellow : "#232323"}
        />
      ),
      iconActive: (
        <MaterialCommunityIcons
          name="monitor-cellphone"
          size={24}
          color={theme === "dark" ? "#000" : "#232323"}
        />
      ),
    },
    {
      id: Crypto.randomUUID(),
      category: "Furnitures",
      icon: (
        <MaterialCommunityIcons
          name="table-furniture"
          size={24}
          color={theme === "dark" ? primaryYellow : "#232323"}
        />
      ),
      iconActive: (
        <MaterialCommunityIcons
          name="table-furniture"
          size={24}
          color={theme === "dark" ? "#000" : "#232323"}
        />
      ),
    },
    {
      id: Crypto.randomUUID(),
      category: "Others",
      icon: (
        <AntDesign
          name="questioncircle"
          size={24}
          color={theme === "dark" ? primaryYellow : "#232323"}
        />
      ),
      iconActive: (
        <AntDesign
          name="questioncircle"
          size={24}
          color={theme === "dark" ? "#000" : "#232323"}
        />
      ),
    },
  ];

  return (
    <View>
      <Text style={styles.mainText}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.container}>
          {data.map((item) => (
            <TouchableOpacity
              style={
                selectedCategory?.category === item.category
                  ? [styles.item, styles.activeItem]
                  : [
                      styles.item,
                      {
                        backgroundColor:
                          theme === "dark" ? "#ffffff10" : "#E5E5E5",
                        shadowColor: theme === "dark" ? "#000" : "#000",
                      },
                    ]
              }
              onPress={() => handleSelect(item)}
              key={item.id}
            >
              <>
                {selectedCategory?.category === item.category
                  ? item?.iconActive
                  : item.icon}
              </>
              <Text
                style={
                  selectedCategory?.category === item.category
                    ? [
                        styles.text,
                        { color: theme === "dark" ? "#000" : "#232323" },
                      ]
                    : [
                        styles.text,
                        { color: theme === "dark" ? primaryYellow : "#232323" },
                      ]
                }
              >
                {item.category === null ? "All" : item.category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Categories;
