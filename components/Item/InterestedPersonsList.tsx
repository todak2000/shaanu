import React, { useState } from "react";
import { View, Pressable, StyleSheet, Alert } from "react-native";
import { Text } from "../Themed";
import { EvilIcons, MaterialIcons } from "@expo/vector-icons";
import { useStore } from "../../app/store";
import { maskString } from "../../app/utils";
import { primaryRed, primaryYellow } from "../../constants/Colors";
import { handleInterest, handleRemoveReciever } from "../../app/db/apis";
import IndicatorLoader from "../IndicatorLoader";
interface interestPersonsProps {
  dataa: string[];
  status: string;
  reciever: string;
  itemId: string;
  pickupAddress: string;
  itemName: string;
  updateItem: () => void;
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
    flexDirection: "row",
    justifyContent: "space-between",
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

const InterestedPersonsList = ({
  dataa,
  status,
  reciever,
  itemId,
  pickupAddress,
  itemName,
  updateItem,
}: interestPersonsProps) => {
  const { theme, userData, fetchData, setData, setLastDoc } = useStore();
  const [closeConfirmation, setCloseConfirmation] = useState<boolean>(
    reciever !== "" ? true : false
  );
  const [confirmation, setConfirmation] = useState<string>(reciever);
  const [clickedItem, setClickedItem] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleConfirmation = (item: string) => {
    setConfirmation(item);
  };
  const cancelSelection = () => {
    setConfirmation("");
  };

  const removeReciever = (recipientId: string) => {
    setClickedItem(recipientId);
    if (recipientId === "") {
      Alert.alert("Sorry, you cannot initate this chat");
    } else {
      setIsLoading(true);
      const data = {
        id: itemId,
        recipientId: recipientId,
      };
      handleRemoveReciever(data).then((res: any) => {
        updateItem();
        setData([]);
        setLastDoc(null);
        fetchData();
        Alert.alert(res?.message);
        setConfirmation(reciever);
        setCloseConfirmation(false);
        setIsLoading(false);
      });
    }
  };

  const handleSelection = async () => {
    setIsLoading(true);
    setClickedItem(confirmation);
    const dat = {
      userId: confirmation,
      id: itemId,

      giverId: userData?.id as string,
      itemId: itemId,
      itemName: itemName,
      pickupAddress: pickupAddress,
      recipientId: confirmation,
    };

    const res = await handleInterest(dat);
    if (res?.statusCode === 200) {
      updateItem();
      setData([]);
      setLastDoc(null);
      fetchData();
      Alert.alert(res?.message);
      setCloseConfirmation(true);
      setIsLoading(false);
    }
  };

  return (
    <>
      {dataa?.map((item) => {
        return (
          <View
            key={item}
            style={[
              styles.item,
              {
                backgroundColor: theme === "dark" ? "#232323" : "#F8F8FA",
              },
            ]}
          >
            <View style={styles.itemSha}>
              <MaterialIcons
                name="person-pin"
                size={20}
                color={theme === "dark" ? "#ccc" : "#232323"}
              />
              <Text style={styles.id}>{maskString(item)}</Text>
            </View>

            {isLoading && clickedItem === item ? (
              <View style={{ marginRight: 20 }}>
                <IndicatorLoader />
              </View>
            ) : (
              <Pressable
                onPress={() => handleConfirmation(item)}
                style={styles.choose}
              >
                {confirmation === item && !closeConfirmation ? (
                  <>
                    <Pressable
                      style={styles.confirmView}
                      onPress={handleSelection}
                    >
                      <Text
                        style={[
                          styles.pick,
                          {
                            color: theme === "dark" ? primaryYellow : "#7CDBB9",
                            marginRight: 30,
                          },
                        ]}
                      >
                        Yes
                      </Text>
                    </Pressable>
                    <Pressable
                      style={styles.confirmView}
                      onPress={cancelSelection}
                    >
                      <Text
                        style={[
                          styles.pick,
                          {
                            color: theme === "dark" ? primaryRed : primaryRed,
                          },
                        ]}
                      >
                        No
                      </Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    {closeConfirmation ||
                    (status !== "Available" && status !== "Rejected") ? (
                      <>
                        {confirmation === item || reciever === item ? (
                          <View style={styles.confirmView}>
                            <MaterialIcons
                              name="beenhere"
                              size={24}
                              color="#7CDBB9"
                              style={{ marginRight: 30 }}
                            />
                            <Pressable
                              onPress={() =>
                                removeReciever(
                                  confirmation === item ? item : ""
                                )
                              }
                            >
                              <MaterialIcons
                                name="cancel"
                                size={24}
                                color={theme === "dark" ? "#ccc" : primaryRed}
                              />
                            </Pressable>
                          </View>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <Text
                          style={[
                            styles.pick,
                            {
                              color:
                                theme === "dark" ? primaryYellow : primaryRed,
                            },
                          ]}
                        >
                          Pick
                        </Text>
                        <EvilIcons
                          name="plus"
                          size={20}
                          color={theme === "dark" ? primaryYellow : primaryRed}
                        />
                      </>
                    )}
                  </>
                )}
              </Pressable>
            )}
          </View>
        );
      })}
    </>
  );
};

export default InterestedPersonsList;
