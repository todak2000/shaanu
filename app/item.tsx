import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Naira } from "../components/Naira";
import { Text, View } from "../components/Themed";
import { useLocalSearchParams } from "expo-router";
import { useStore } from "./store";
import { primaryRed, primaryYellow } from "../constants/Colors";
import { ImageGrid } from "../components/Item/ImageGrid";
import { useState, useEffect } from "react";
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter, router } from "expo-router";
import Button from "../components/Button";
import InterestedPersonsList from "../components/Item/InterestedPersonsList";
import { ScrollView } from "react-native-gesture-handler";
import {
  handlePotentialInterest,
  handleRemoveInterest,
  handleSingleItem,
} from "./db/apis";
import { GridItem } from "../components/Home/GridList";
import Loader from "../components/Loader";

const screenHeight = Dimensions.get("window").height;

export default function DonationItemView() {
  const { id } = useLocalSearchParams();
  const {
    theme,
    loading,
    userData,
    fetchData,
    setData,
    setLoading,
    setLastDoc,
  } = useStore();
  const navigation = useRouter();

  const [isInterested, setIsInterested] = useState<boolean>(false);
  const [item, setItem] = useState<GridItem>();

  const intiateChat = (recipientId: string) => {
    if (recipientId === "") {
      Alert.alert("Sorry, you cannot initate this chat");
    } else {
      const chatData = {
        giverId: item?.donor,
        recipientId: userData?.id,
      };
      console.log(chatData, "chatData Recipient");

      router.replace({
        pathname: "/chat",
        params: {
          giverId: item?.donor as string,
          recipientId: userData?.id as string,
        },
      });
    }
  };

  const handleCancelInterest = async () => {
    setLoading(true);
    const data = { id: id as string, userId: userData?.id as string };
    const res = await handleRemoveInterest(data);
    if (res?.statusCode === 200) {
      handleGetItem().then(() => {
        setData([]);
        setLastDoc(null);
        fetchData();
        Alert.alert(res?.message);
        setIsInterested(false);
      });
    }
  };

  const handleConfirmInterest = async () => {
    setLoading(true);

    const data = { id: id as string, userId: userData?.id as string };

    if ((item?.interestedParties as string[]).length < 5) {
      const res = await handlePotentialInterest(data);
      if (res?.statusCode === 200) {
        setLoading(false);
        handleGetItem().then(() => {
          setData([]);
          setLastDoc(null);

          fetchData();
          setIsInterested(true);
        });
      }
      Alert.alert(res?.message as string);
    } else {
      Alert.alert(
        "We regret to inform you that the interest quota has been exceeded. We apologize for any inconvenience this may have caused. Thank you for your understanding."
      );
    }
  };

  const handleGetItem = async () => {
    await handleSingleItem(id as string).then((res) => {
      if (res?.statusCode === 200) {
        setItem(res.singleItem);
        setLoading(false);
      }
    });
  };
  useEffect(() => {
    setLoading(true);
    handleGetItem();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.back}
              onPress={() => navigation.back()}
            >
              <Ionicons
                name="ios-chevron-back-outline"
                size={24}
                color={theme === "dark" ? "#fff" : "black"}
              />
            </TouchableOpacity>
            {item?.category === "Cash" ? (
              <Text style={styles.title}>
                Cash Donation of{" "}
                <Naira
                  style={{ fontSize: 10 }}
                  color={theme === "dark" ? primaryYellow : primaryRed}
                />{" "}
                {item?.name}
              </Text>
            ) : (
              <Text style={styles.title}>{item?.name}</Text>
            )}
          </View>
          {loading ? (
            <Loader />
          ) : (
            <>
              {item?.category === "Cash" ? (
                <View style={styles.cash}>
                  <MaterialCommunityIcons
                    name="bank-outline"
                    style={{ padding: 20 }}
                    size={100}
                    color={theme === "dark" ? "#f0f0f0" : "#ccc"}
                  />
                </View>
              ) : (
                <ImageGrid imageUrls={item?.imageUrl as string[]} />
              )}
              <View style={styles.lowerView}>
                <View
                  style={[
                    styles.disabled,
                    {
                      backgroundColor: theme === "dark" ? "#232323" : "#F8F8FA",
                    },
                  ]}
                >
                  <MaterialIcons name="category" size={16} color="#08B72F" />
                  <Text style={styles.disbaledText}>{item?.category}</Text>
                </View>
                <View
                  style={[
                    styles.disabled,
                    {
                      backgroundColor: theme === "dark" ? "#232323" : "#F8F8FA",
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="progress-check"
                    size={16}
                    color="#08B72F"
                  />
                  <Text style={styles.disbaledText}>{item?.status}</Text>
                </View>
                <View
                  style={[
                    styles.disabled,
                    {
                      backgroundColor: theme === "dark" ? "#232323" : "#F8F8FA",
                    },
                  ]}
                >
                  <Ionicons
                    name="ios-location"
                    size={16}
                    color={theme === "dark" ? "#f0f0f0" : "#ccc"}
                  />
                  <Text style={styles.disbaledText}>{item?.location}</Text>
                </View>
                <View
                  style={[
                    styles.disabled,
                    {
                      backgroundColor: theme === "dark" ? "#232323" : "#F8F8FA",
                    },
                  ]}
                >
                  <Ionicons
                    name="ios-people-outline"
                    size={16}
                    color={theme === "dark" ? primaryYellow : primaryRed}
                  />
                  <Text style={styles.disbaledText}>
                    {item?.interestedParties?.length}
                  </Text>
                </View>
                {userData?.id === item?.donor ? (
                  <>
                    <Text style={styles.repHeader}>Potential Recipients</Text>
                    {(item?.interestedParties as string[])?.length > 0 ? (
                      <InterestedPersonsList
                        dataa={item?.interestedParties as string[]}
                        status={item?.status as string}
                        reciever={item?.reciever as string}
                        itemId={item?.id as string}
                        updateItem={handleGetItem}
                      />
                    ) : (
                      <View style={styles.noPerson}>
                        <MaterialCommunityIcons
                          name="account-cancel-outline"
                          size={100}
                          color={theme === "dark" ? "#232323" : "#ccc"}
                        />
                        <Text
                          style={[
                            styles.warning,
                            {
                              color:
                                theme === "dark" ? primaryYellow : primaryRed,
                            },
                          ]}
                        >
                          There are no interest in this item yet!
                        </Text>
                      </View>
                    )}
                  </>
                ) : (
                  <>
                    {isInterested ||
                    item?.interestedParties.includes(userData?.id as string) ? (
                      <>
                        <Text
                          style={[
                            styles.warning,
                            {
                              color:
                                theme === "dark" ? primaryYellow : primaryRed,
                            },
                          ]}
                        >
                          Please be advised that the next step in the process is
                          for the donor to accept your request. We kindly ask
                          for your patience while this takes place. Thank you
                          for your understanding. 😊
                        </Text>
                        <Button
                          onPress={
                            userData?.id !== item?.donor
                              ? handleCancelInterest
                              : () => null
                          }
                          title="Withdraw Interest"
                          icon={false}
                          color={theme === "dark" ? primaryRed : "gray"}
                          isLoading={loading}
                          theme={theme}
                        />

                        {item?.reciever === userData?.id && (
                          <View style={{ marginTop: 20 }}>
                            <Button
                              onPress={
                                item?.reciever === userData?.id
                                  ? intiateChat
                                  : () => null
                              }
                              title="Chat with your Donor"
                              icon={false}
                              color={
                                theme === "dark" ? primaryYellow : "#7CDBB9"
                              }
                              isLoading={loading}
                              theme={theme}
                            />
                          </View>
                        )}
                      </>
                    ) : (
                      <>
                        <Text
                          style={[
                            styles.warning,
                            {
                              color:
                                theme === "dark" ? primaryYellow : primaryRed,
                            },
                          ]}
                        >
                          You are advised to exercise caution when sharing
                          financial/Personal details with third parties. Shaanu
                          app is not to be held liable for any issues arising
                          from transactions where users disclose their financial
                          information. You share your details at their own risk,
                          and should read the terms and conditions carefully
                          before proceeding with any transaction.
                        </Text>
                        <Button
                          onPress={
                            userData?.id !== item?.donor
                              ? handleConfirmInterest
                              : () => null
                          }
                          title="I am Interested"
                          icon={false}
                          color={theme === "dark" ? primaryYellow : "black"}
                          isLoading={loading}
                          theme={theme}
                        />
                      </>
                    )}
                  </>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "10%",
    minHeight: screenHeight,
  },
  warning: {
    fontFamily: "MuseoRegular",
    textAlign: "center",
    marginTop: 40,
    fontSize: 12,
    marginBottom: 20,
  },
  repHeader: {
    fontFamily: "MuseoBold",
  },
  title: {
    fontSize: 16,
    fontFamily: "MuseoBold",
    width: "100%",
    textAlign: "center",
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 10,
  },
  lowerView: {
    padding: "5%",
  },
  disabled: {
    padding: 10,
    borderColor: "transparent",
    borderWidth: 0.5,
    borderRadius: 3,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  disbaledText: {
    fontFamily: "MuseoRegular",
    fontSize: 12,
    marginLeft: 5,
  },
  back: {
    position: "absolute",
    top: 0,
    left: "5%",
    zIndex: 1000,
  },
  cash: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  noPerson: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
