import { StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import Wrapper from "../../components/Wrapper";
import { Text, View } from "../../components/Themed";
import { useStore } from "../store";
import { handleCatalogList } from "../db/apis";
import { GridItem } from "../../components/Home/GridList";
import ItemList from "../../components/Catalog/ItemList";
import { primaryYellow } from "../../constants/Colors";

const title = "Catalog";

function CatalogScreenView() {
  const [itemsArr, setItemsArr] = useState<GridItem[]>([]);
  const { userData, theme } = useStore();
  const [activeTab, setActiveTab] = useState("One");

  useEffect(() => {
    handleCatalogList(userData?.id as string).then((res) => {
      setItemsArr(res?.catalogList as GridItem[]);
    });
  });
  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  const tabArr = [
    {
      id: 1,
      name: "Donations",
      value: "One",
    },
    {
      id: 2,
      name: "Requests",
      value: "Two",
    },
  ];
  return (
    <>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          {tabArr.map(
            ({
              id,
              value,
              name,
            }: {
              id: number;
              value: string;
              name: string;
            }) => {
              return (
                <TouchableOpacity
                  key={id}
                  style={[
                    styles.tab,
                    activeTab === value && theme === "dark"
                      ? styles.activeTabDark
                      : activeTab === value && theme === "light"
                      ? styles.activeTabLight
                      : null,
                  ]}
                  onPress={() => handleTabPress(value)}
                >
                  <Text style={styles.tabText}>{name}</Text>
                </TouchableOpacity>
              );
            }
          )}
        </View>

        <View style={styles.contentContainer}>
          <ItemList
            dataa={itemsArr?.filter((item) =>
              activeTab === "One"
                ? item?.donor === userData?.id
                : item?.interestedParties?.includes(userData?.id as string)
            )}
          />
        </View>
      </View>
    </>
  );
}

const CatalogScreen = Wrapper(CatalogScreenView);

export default CatalogScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: "MuseoBold",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },

  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingVertical: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  activeTabDark: {
    backgroundColor: primaryYellow,
  },
  activeTabLight: {
    backgroundColor: "#ccc",
  },
  tabText: {
    fontFamily: "MuseoRegular",
  },
  contentContainer: {
    flex: 1,
    padding: "5%",
  },
});
