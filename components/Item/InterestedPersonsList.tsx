import React, { useState } from "react";
import { View, Pressable, StyleSheet, Alert } from "react-native";
import { Text } from "../Themed";
import { EvilIcons, MaterialIcons, Entypo } from "@expo/vector-icons";
import { useStore } from "../../app/store";
import { router } from "expo-router";
import { maskString } from "../../app/utils";
import { primaryRed, primaryYellow } from "../../constants/Colors";
import { handleInterest } from "../../app/db/apis";
import Loader from "../Loader";

interface interestPersonsProps {
  dataa: string[];
  status: string;
  reciever: string;
  itemId: string;
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

const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const InterestedPersonsList = ({
  dataa,
  status,
  reciever,
  itemId,
  updateItem,
}: interestPersonsProps) => {
  const { theme, userData, fetchData, setData, setLastDoc } = useStore();
  const [closeConfirmation, setCloseConfirmation] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleConfirmation = (item: string) => {
    setConfirmation(item);
  };
  const cancelSelection = () => {
    setConfirmation("");
  };

  const intiateChat = (recipientId: string) => {
    if (recipientId === "") {
      Alert.alert("Sorry, you cannot initate this chat");
    } else {
      const chatData = {
        giverId: userData?.id,
        recipientId: recipientId,
      };
      console.log(chatData, "chatData Donor");

      router.replace({
        pathname: "/chat",
        params: {
          giverId: userData?.id as string,
          recipientId: recipientId,
        },
      });
    }
  };
  const handleSelection = async () => {
    setIsLoading(true);

    const dat = {
      userId: confirmation,
      id: itemId,
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

            <Pressable
              onPress={() => handleConfirmation(item)}
              style={styles.choose}
            >
              {confirmation === item && !closeConfirmation ? (
                <>
                  {isLoading ? (
                    <View style={{ marginRight: 20 }}>
                      <Loader />
                    </View>
                  ) : (
                    <>
                      <Pressable
                        style={styles.confirmView}
                        onPress={handleSelection}
                      >
                        <Text
                          style={[
                            styles.pick,
                            {
                              color:
                                theme === "dark" ? primaryYellow : "#7CDBB9",
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
                  )}
                </>
              ) : (
                <>
                  {closeConfirmation ||
                  (status !== "Available" && status !== "Rejected") ? (
                    <>
                      {confirmation === item ? (
                        <View style={styles.confirmView}>
                          <MaterialIcons
                            name="beenhere"
                            size={24}
                            color="#7CDBB9"
                            style={{ marginRight: 30 }}
                          />
                          <Pressable
                            onPress={() =>
                              intiateChat(confirmation === item ? item : "")
                            }
                          >
                            <Entypo
                              name="chat"
                              size={24}
                              color={
                                theme === "dark" ? primaryYellow : primaryRed
                              }
                            />
                          </Pressable>
                        </View>
                      ) : (
                        <MaterialIcons
                          name="pending"
                          size={24}
                          color={theme === "dark" ? primaryYellow : primaryRed}
                        />
                      )}
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
          </View>
        );
      })}
    </>
  );
};

export default InterestedPersonsList;