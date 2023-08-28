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
  category: string | null;
};

export type dataProps = {
  data: categoryProps[];
  selectedCategory: categoryProps | null;
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<categoryProps | null>
  >;
};
const Categories = ({
  data,
  setSelectedCategory,
  selectedCategory,
}: dataProps) => {
  const { theme, setLoading } = useStore();

  const handleSelect = (item: categoryProps) => {
    setLoading(true);
    setSelectedCategory(item);
  };

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
              <>{item.icon}</>
              <Text
                style={[
                  styles.text,
                  { color: theme === "dark" ? primaryYellow : "#232323" },
                ]}
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
