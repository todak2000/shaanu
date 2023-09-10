import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Naira } from "../components/Naira";
import { Text, View } from "../components/Themed";
import { useStore } from "./store";
import { primaryRed, primaryYellow } from "../constants/Colors";
import { ImageGrid } from "../components/Item/ImageGrid";
import { useState, useEffect } from "react";
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { sendExpoNotification, maskString } from "./utils";
import { useRouter, router, useLocalSearchParams } from "expo-router";
import Button from "../components/Button";
import InterestedPersonsList from "../components/Item/InterestedPersonsList";
import { ScrollView } from "react-native-gesture-handler";
import {
  handlePotentialInterest,
  handleRemoveInterest,
  handleSingleItem,
  handleConfirmDelivery,
  getExpoToken,
} from "./db/apis";
import { GridItem } from "../components/Home/GridList";

const screenHeight = Dimensions.get("window").height;

export default function DonationItemView() {

  const { id } = useLocalSearchParams();
  const { allData, getAllItemDataStore } = useStore();

  const {
    theme,
    loading,
    userData,
    fetchData,
    setData,
    setLoading,
    setLastDoc,
    setAlertMessage,
    setAlertTitle,
    showAlert
  } = useStore();
  const navigation = useRouter();

  const [isInterested, setIsInterested] = useState<boolean>(false);
  const [item, setItem] = useState<GridItem>();

  const intiateChat = (recipientId: string) => {
    if (recipientId === "") {
      setAlertMessage("Apologies, but you are unable to initiate this chat at the moment.")
        setAlertTitle("Unauthorized Access!")
        showAlert()
    } else {
      router.replace({
        pathname: "/chat",
        params: {
          giverId: item?.donor as string,
          recipientId: userData?.id as string,
          chatId: item?.id as string,
        },
      });
    }
  };

  const handleDelivery = async () => {
    handleDeliveryLocal();
    const data = {
      itemId: id as string,
      donorId: item?.donor as string,
      recieverId: userData?.id as string,
    };
    const res = await handleConfirmDelivery(data);
    if (res?.statusCode === 200) {
        setAlertMessage(res?.message as string)
        setAlertTitle("Delievery Confirmation")
        showAlert()
      setLoading(false);
      setData([]);
      setLastDoc(null);
      fetchData();
      getAllItemDataStore();

      getExpoToken(item?.donor as string).then((result) => {
        const title = `Donation Confirmed! 📫`;
        const message = `Thank you for your generous donation. The recipient has confirmed the collection of the item. Your kindness has made a difference.`;
        if (result.statusCode === 200) {
          const donorToken = result?.token;
          sendExpoNotification(donorToken as string, title, message)
            .then((result) => console.log(result, "successful"))
            .catch((error) => console.error(error, "error"));
        }
      });
    } else {
      handleDeliveryLocalReverse();
    }
  };

  const handleCancelInterest = async () => {
    handleConfirmInterestLocalReverse();
    const data = { id: id as string, userId: userData?.id as string };

    if ((item?.interestedParties as string[]).length < 5) {
      const res = await handleRemoveInterest(data);
      if (res?.statusCode === 200) {
        setLoading(false);
        setData([]);
        setLastDoc(null);
        fetchData();
        getAllItemDataStore();
        getExpoToken(item?.donor as string).then((result) => {
          const title = `${
            (item?.interestedParties as string[]).length > 1
              ? item?.interestedParties?.length + " Withdrawals"
              : 1 + " Withdrawal"
          } of Interest! 📫`;
          const message = `We regret to inform you that ${
            (item?.interestedParties as string[]).length > 1
              ? item?.interestedParties?.length + " Persons"
              : 1 + " Person"
          } has withdrawn their interest in the item you donated. Thank you for your generosity and understanding.`;
          if (result.statusCode === 200) {
            const donorToken = result?.token;
            sendExpoNotification(donorToken as string, title, message)
              .then((result) => console.log(result, "successful"))
              .catch((error) => console.error(error, "error"));
          }
        });
      }
    }
  };

  const handleDeliveryLocal = () => {
    setItem((prevItem: any) => ({
      ...prevItem,
      status: "Delivered",
    }));
    setIsInterested(false);
  };
  const handleDeliveryLocalReverse = () => {
    setItem((prevItem: any) => ({
      ...prevItem,
      status: "Paired",
    }));
  };

  const handleConfirmInterestLocalReverse = () => {
    setItem((prevItem: any) => ({
      ...prevItem,
      interestedParties: !prevItem.interestedParties.includes(
        userData?.id as string
      )
        ? prevItem.interestedParties
        : prevItem.interestedParties.filter(
            (party: string) => party !== (userData?.id as string)
          ),
    }));
    setIsInterested(true);
  };

  const handleConfirmInterestLocal = () => {
    setItem((prevItem: any) => ({
      ...prevItem,
      interestedParties: !prevItem.interestedParties.includes(
        userData?.id as string
      )
        ? [...prevItem.interestedParties, userData?.id as string]
        : [...prevItem.interestedParties],
    }));
    setIsInterested(false);
  };
  // console.log(userData, 'user data item')
  const handleConfirmInterest = async () => {
    handleConfirmInterestLocal();

    const data = { id: id as string, userId: userData?.id as string };

    if ((item?.interestedParties as string[]).length < 5) {
      const res = await handlePotentialInterest(data);
      // console.log(res,"itme ress")
      if (res?.statusCode === 200) {
        setLoading(false);
        setData([]);
        setLastDoc(null);

        fetchData();
        getAllItemDataStore();
        getExpoToken(item?.donor as string).then((result) => {
          const title = `${
            (item?.interestedParties as string[]).length > 1
              ? item?.interestedParties?.length + " Interests"
              : 1 + " Interest"
          } in Your Donation! 📫`;
          const message = `Hurray! ${
            (item?.interestedParties as string[]).length > 1
              ? item?.interestedParties?.length + " Persons"
              : 1 + " Person"
          } has just declared interest in the item you donated. Thank you for your generosity.`;
          if (result.statusCode === 200) {
            const donorToken = result?.token;
            sendExpoNotification(donorToken as string, title, message)
              .then((result) => console.log(result, "successful"))
              .catch((error) => console.error(error, "error"));
          }
        });
      } else {
        handleConfirmInterestLocalReverse();
      }
    } else {
      setAlertMessage("We regret to inform you that the interest quota has been exceeded. We apologize for any inconvenience this may have caused. Thank you for your understanding.")
        setAlertTitle("Unconfirmed Interest")
        showAlert()
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
    getAllItemDataStore();
    const item: any = allData.filter((x) => x.id === id);
    setItem(item[0]);
    setLoading(false);
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
                size={40}
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
              {item?.location !== "Searching..." &&
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
            }
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
                  color={theme === "dark" ? primaryRed : primaryYellow}
                />
                <Text style={styles.disbaledText}>{item?.pickupAddress}</Text>
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

              {userData?.id === item?.donor && item?.status !== "Delivered" ? (
                <>
                  <Text style={styles.repHeader}>Potential Recipients</Text>
                  {(item?.interestedParties as string[])?.length > 0 ? (
                    <>
                      <InterestedPersonsList
                        dataa={item?.interestedParties as string[]}
                        status={item?.status as string}
                        reciever={item?.reciever as string}
                        itemId={item?.id as string}
                        itemName={item?.name as string}
                        pickupAddress={item?.pickupAddress as string}
                        updateItem={handleGetItem}
                      />
                      {item?.reciever !== "" && (
                        <>
                          <Button
                            onPress={intiateChat}
                            title={`Continue Chat with ${maskString(
                              item?.reciever
                            )}`}
                            icon={false}
                            color={theme === "dark" ? primaryYellow : "#000"}
                            isLoading={loading}
                            theme={theme}
                          />
                        </>
                      )}
                    </>
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
                  {item?.interestedParties?.includes(userData?.id as string) &&
                  item.status !== "Delivered" ? (
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
                        for the donor to accept your request. We kindly ask for
                        your patience while this takes place. Thank you for your
                        understanding. 😊
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

                      {item?.reciever === userData?.id &&
                        item.status === "Paired" && (
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
                            <View style={{ margin: 10 }}></View>
                            <Button
                              onPress={handleDelivery}
                              title={`Confirm Item is Recieved`}
                              icon={false}
                              color="#08B72F"
                              isLoading={loading}
                              theme={theme}
                            />
                          </View>
                        )}
                    </>
                  ) : (
                    !loading &&
                    item?.status !== "Delivered" && (
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
                    )
                  )}
                </>
              )}
            </View>
          </>
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
    marginBottom: 15,
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
