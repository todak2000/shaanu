import { Pressable, SafeAreaView, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { useLocalSearchParams } from "expo-router";
import { useStore } from "./store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { maskString } from "./utils";

export default function ChatView() {
  const { giverId, recipientId } = useLocalSearchParams();
  const { theme, userData } = useStore();
  const navigation = useRouter();

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
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

          <View style={styles.lowerView}></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "10%",
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
});
