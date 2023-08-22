import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "../Themed";
import {
  MaterialCommunityIcons,
  Entypo,
  AntDesign,
  Ionicons,
  MaterialIcons
} from "@expo/vector-icons";
import { useStore } from "../../app/store";
import { router } from "expo-router";
import { maskString } from "../../app/utils";
import { primaryRed, primaryYellow } from "../../constants/Colors";
import { GridItem } from "../Home/GridList";
import { itemsArray } from "../../constants/items";

interface interestPersonsProps {
  dataa: GridItem[];
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
    marginBottom: 10,
    padding: 10,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 3,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowTwo: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
  },
  itemSha: {
    flexDirection: "row",
  },
  textContainer: {
    padding: 10,
  },
  choose: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: 100,
    height: "100%",
    position: "absolute",
    right: 20,
  },
  name: {
    fontFamily: "MuseoBold",
    fontSize: 14,
    marginTop: -5,
  },
  confirmView: {
    flexDirection: "row",
  },
  loadingText: {
    fontFamily: "Museo",
    fontSize: 16,
  },
  pick: {
    fontFamily: "MuseoBold",
  },
  id: {
    fontFamily: "MuseoRegular",
    fontSize: 12,
    marginLeft: 5,
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
  noPerson:{
    justifyContent:'center',
    alignItems:'center',
    padding:20,
  },
  warning: {
    fontFamily: "MuseoRegular",
    textAlign: "center",
    marginTop: 40,
    fontSize: 12,
    marginBottom:20,
  },
});

const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const ItemList = ({ dataa }: interestPersonsProps) => {
  const { theme, userData, setLoading } = useStore();

  const handleItemDetails = (id: string) => {
    setLoading(true);
    router.push({
      pathname: "/item",
      params: {
        id: id,
      },
    });
  };

  return (
    <>
      {dataa.length > 0 ? dataa?.map((item) => {
        return (
          <TouchableOpacity
          onPress={() => handleItemDetails(item.id)}
          key={item?.id}
          style={[
            styles.item,
            {
              backgroundColor: theme === "dark" ? "#232323" : "#F8F8FA",
            },
          ]}
        >
          <View style={styles.rowTwo}>
            <View style={styles.itemSha}>
              <Entypo
                name="circular-graph"
                size={15}
                color={theme === "dark" ? "#7CDBB9" : primaryRed}
              />
              <Text style={styles.id}>{item.name} </Text>
            </View>

            {item?.reciever === "" && item?.status === "Delivered" && (
              <View style={styles.itemSha}>
                <Ionicons
                  name="person-outline"
                  size={16}
                  color={theme === "dark" ? primaryYellow : "#7CDBB9"}
                />
                <Text style={styles.id}>
                  Recipient: {maskString(item?.reciever)}{" "}
                </Text>
              </View>
            )}
            <View style={styles.itemSha}>
              <MaterialCommunityIcons
                name="progress-check"
                size={16}
                color="#08B72F"
              />
              <Text style={styles.id}>{item?.status}</Text>
            </View>
          </View>
          {/* } */}
          <View style={styles.rowTwo}>
            {item.donor === userData?.id && (
              <View style={styles.itemSha}>
                <Ionicons
                  name="ios-people-outline"
                  size={16}
                  color={theme === "dark" ? primaryYellow : "#7CDBB9"}
                />
                <Text style={styles.id}>
                  {item?.interestedParties?.length}{" "}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.choose}
            onPress={() => handleItemDetails(item.id)}
          >
            <AntDesign
              name="right"
              size={20}
              color={theme === "dark" ? primaryYellow : "#232323"}
            />
          </TouchableOpacity>
        </TouchableOpacity>
          
        );
      
      })
    :
    <View style={styles.noPerson}>
      <MaterialIcons name="category" size={100} color={theme === 'dark'? '#232323': '#ccc'}  />
        <Text style={[styles.warning, {color: theme === 'dark'? primaryYellow: primaryRed}]}>You don't have any recent Donations/Requests</Text>
      </View>
    }
    </>
  );
};

export default ItemList;
