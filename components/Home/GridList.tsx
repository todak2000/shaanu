import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  Image,
  StyleSheet,
} from "react-native";

import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useStore } from "../../app/store";
import { DocumentData } from "firebase/firestore";
import { router } from "expo-router";
import { Naira } from "../Naira";
import { primaryRed, primaryYellow } from "../../constants/Colors";
export interface GridItem {
  id?: string | any;
  name: string;
  imageUrl: string[];
  category: string;
  donor: string;
  status: string;
  location: string;
  interestedParties: string[];
  pickupAddress?: string | any;
  reciever?: string | any;
  deliveryDate?: string;
}

interface GridListProps {
  data: GridItem[];
  lastDoc: DocumentData | null;
  fetchData: (data: any) => void;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "hidden",
    justifyContent: "space-between",
  },
  loadingMore: {
    padding: 16,
    alignItems: "center",
    width: "100%",
  },
  item: {
    borderRadius: 10,
    marginBottom: 10,

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  imageContainer: {
    flexDirection: "row",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
  },
  textContainer: {
    padding: 10,
  },
  name: {
    fontFamily: "MuseoBold",
    fontSize: 14,
    marginTop: -5,
  },
  loadingText: {
    fontFamily: "Museo",
    fontSize: 16,
  },
  textNormal: {
    fontFamily: "MuseoRegular",
    fontSize: 12,
    marginLeft: 3,
  },
  statusView: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusViewTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
    justifyContent: "space-between",
  },
});

const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const GridList = ({
  data,
  lastDoc,
  fetchData,
}: GridListProps) => {
  const {inventoryState, inventoryDispatch, theme, userData, setLoading, curentLoc } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const onRefresh = () => {
    const data = {
      oldData: inventoryState.inventory,
      category: '' 
    }
    setRefreshing(true);
    fetchData(data);
    wait(2000).then(() => setRefreshing(false));
  };

  const onRefreshCallBack = useCallback(() => {
    onRefresh();
  }, []);

  
  const loadMoreData = () => {
    if (!loadingMore && lastDoc) {
      const data = {
        afterDoc: lastDoc,
        oldData: inventoryState.inventory ,
        category:''
      }
      setLoadingMore(true);
      fetchData(data);
      wait(2000).then(() => setLoadingMore(false));
    }
  };

  const handleDetails = (item: any) => {
    // console.log(item, 'tieieree');
    // setLoading(true);
    router.push({
      pathname: "/item",
      params: {
        id: item?.id,
      },
    });
  };

  return (
    <FlatList
      style={{ marginBottom: 20 }}
      showsVerticalScrollIndicator={false}
      data={data}
      keyExtractor={(item: any) => item.id}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => handleDetails(item)}
          key={item.id}
          style={[
            styles.item,
            {
              backgroundColor: theme === "dark" ? "#ffffff15" : "#f0f0f0",
              shadowColor: theme === "dark" ? "#000" : "#000",
            },
          ]}
        >
          <View style={styles.imageContainer}>
            {item?.category === "Cash" ? (
              <MaterialCommunityIcons
                name="bank-outline"
                style={{ padding: 20 }}
                size={100}
                color={theme === "dark" ? "#f0f0f0" : "#ccc"}
              />
            ) : (
              <Image source={{ uri: item?.imageUrl[0] }} style={styles.image} />
            )}
          </View>

          <View style={styles.textContainer}>
            {item?.category === "Cash" ? (
              <Text
                style={[
                  styles.name,
                  { color: theme === "dark" ? "#f0f0f0" : "#000" },
                ]}
              >
                <Naira
                  style={{ fontSize: 10 }}
                  color={theme === "dark" ? primaryYellow : primaryRed}
                />{" "}
                {item.name}
              </Text>
            ) : (
              <Text
                style={[
                  styles.name,
                  { color: theme === "dark" ? "#f0f0f0" : "#000" },
                ]}
              >
                {item.name}
              </Text>
            )}
            <View style={styles.statusViewTop}>
              <View style={styles.statusView}>
                <MaterialCommunityIcons
                  name="progress-check"
                  size={16}
                  color="#08B72F"
                />
                <Text
                  style={[
                    styles.textNormal,
                    { color: theme === "dark" ? "#f0f0f0" : "#000" },
                  ]}
                >
                  {item.status}{" "}
                </Text>
              </View>
              <View style={styles.statusView}>
                <Ionicons
                  name="ios-location"
                  size={16}
                  color={theme === "dark" ? "#f0f0f0" : "#ccc"}
                />
                <Text
                  style={[
                    styles.textNormal,
                    { color: theme === "dark" ? "#f0f0f0" : "#000" },
                  ]}
                >
                  {item.location !== 'Searching...' ? item.location : item.pickupAddress}
                </Text>
              </View>
            </View>
            {userData?.id === item.donor && (
              <View style={styles.statusViewTop}>
                <View style={styles.statusView}>
                  <MaterialCommunityIcons
                    name="emoticon-kiss-outline"
                    size={16}
                    color="#E41B17"
                  />
                  <Text
                    style={[
                      styles.textNormal,
                      { color: theme === "dark" ? "#f0f0f0" : "#000" },
                    ]}
                  >
                    donated by you
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Pressable>
      )}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefreshCallBack} />
      }
      onEndReached={data.length > 1 ? loadMoreData : null}
      onEndReachedThreshold={0.01}
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.loadingMore}>
            <Text
              style={[
                styles.loadingText,
                { color: theme === "dark" ? "#f0f0f0" : "#232323" },
              ]}
            >
              Loading more...
            </Text>
          </View>
        ) : null
      }
    />
  );
};

export default GridList;
