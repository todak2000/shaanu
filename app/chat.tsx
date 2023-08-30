import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { Text, View } from "../components/Themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { useStore } from "./store";
import { Ionicons } from "@expo/vector-icons";
import { dateFormaterString, maskString, sendExpoNotification } from "./utils";
import { handleUpdateChat, getExpoToken } from "./db/apis";
import { chatProps } from "./db/apis";
import { ChatText } from "../components/ChatText";
import ChatEdit from "../components/ChatEdit";
import * as Crypto from "expo-crypto";
import { doc, onSnapshot } from "@firebase/firestore";
import { db } from "./db/firebase";

const screenHeight = Dimensions.get("window").height;

export default function ChatView() {
  const { giverId, recipientId, chatId } = useLocalSearchParams();
  const { theme, userData } = useStore();
  const [chatData, setChatData] = useState<chatProps>();
  const [chatText, setChatText] = useState<string>("");
  const navigation = useRouter();

  const flatListRef = useRef<FlatList>(null);

  const handleChatData = async () => {
    setChatText("");
    try {
      const chatt = doc(db, "Chat", chatId as string);
      onSnapshot(chatt, (querySnapshot) => {
        if (querySnapshot) {
          setChatData({
            chatId: chatId as string,
            donorId: querySnapshot.data()?.donorId,
            itemName: querySnapshot.data()?.itemName,
            recipientId: querySnapshot.data()?.recipientId,
            chatCorrespondence: querySnapshot
              .data()
              ?.chatCorrespondence.reverse(),
          });
        }
      });
    } catch (error: any) {
      return { statusCode: 501, chatData: null };
    }
  };

  const handleChat = async () => {
    const data = {
      chatId: chatId as string,
      messengerId: userData?.id as string,
      message: chatText,
    };
    let newMessage = {
      [userData?.id as string]: chatText,
      timestamp: dateFormaterString(new Date().toString()),
    };
    setChatData((prevData: any) => ({
      ...prevData,
      chatCorrespondence: [
        ...prevData.chatCorrespondence,
        newMessage,
      ].reverse(),
    }));
    setChatText("");
    handleUpdateChat(data).then((res) => {
      if (res?.statusCode !== 200) {
        setChatData((prevData: any) => ({
          ...prevData,
          chatCorrespondence: prevData.chatCorrespondence
            .filter(
              (obj: any, i: number) => obj.timestamp !== newMessage.timestamp
            )
            .reverse(),
        }));
      } else {
        const id =
          userData?.id === chatData?.donorId
            ? chatData?.recipientId
            : chatData?.donorId;
        getExpoToken(id as string).then((result) => {
          const title = `New Message Alert! 📫`;
          const message = `You have a new message waiting for you. Check it out now!`;
          if (result.statusCode === 200) {
            const token = result?.token;
            sendExpoNotification(token as string, title, message)
              .then((result) => console.log(result, "successful"))
              .catch((error) => console.error(error, "error"));
          }
        });
      }
      handleChatData();
    });
  };

  useEffect(() => {
    handleChatData();
  }, []);

  return (
    <SafeAreaView>
      <View
        style={[
          styles.container,
          { backgroundColor: theme === "dark" ? "transparent" : "#fff" },
        ]}
      >
        <View style={styles.header}>
          <Pressable style={styles.back} onPress={() => navigation.back()}>
            <Ionicons
              name="ios-chevron-back-outline"
              size={24}
              color={theme === "dark" ? "#fff" : "black"}
            />
          </Pressable>
          <Text style={styles.title}>
            Chat session with{" "}
            {userData?.id === giverId
              ? maskString(recipientId as string)
              : maskString(giverId as string)}
          </Text>
        </View>

        <View style={styles.lowerView}>
          <FlatList
            inverted
            style={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              if (flatListRef.current) {
                flatListRef.current.scrollToEnd();
              }
            }}
            data={chatData?.chatCorrespondence as []}
            keyExtractor={(item) => Crypto.randomUUID()}
            renderItem={({ item }) => {
              const entries = Object.entries(item);
              let timestamp, message, messenger;
              for (const [key, value] of entries) {
                if (key === "timestamp") {
                  timestamp = value;
                } else {
                  message = value;
                  messenger = key;
                }
              }
              return (
                <ChatText
                  timestamp={timestamp as string}
                  message={message as string}
                  messenger={messenger as string}
                />
              );
            }}
          />
        </View>
        <ChatEdit
          handleChat={handleChat}
          chatText={chatText}
          setChatText={setChatText}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "10%",
    minHeight: screenHeight,
  },
  noPerson: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  warning: {
    fontFamily: "MuseoRegular",
    textAlign: "center",
    marginTop: 40,
    fontSize: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 12,
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
    paddingTop: "5%",
    height: screenHeight * 0.7,
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
});
