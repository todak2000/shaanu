import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Dimensions, Platform } from "react-native";
import { useStore } from "../app/store";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const screenHeight = Dimensions.get("window").height;

const ChatEdit = ({
  handleChat,
  chatText,
  setChatText,
}: {
  handleChat:()=> void;
  chatText: string;
  setChatText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { theme } = useStore();

  const updateChat = async (text: string) => {
    setChatText(text);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#232323" : "#E5E5E5" },
      ]}
    >
      
      <TextInput
        style={[styles.input, { color: theme === "dark" ? "#ccc" : "#232323" }]}
        value={chatText}
        onChangeText={updateChat}
        placeholder="Enter your message here"
        placeholderTextColor={theme === "dark" ? "#ffffff30" : "gray"}
        clearButtonMode="while-editing"
      />
      <TouchableOpacity onPress={handleChat}>
        <MaterialCommunityIcons name="send-circle" size={60} color="gray" />
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    position:'absolute',
    bottom: Platform.OS ===  'ios' ? screenHeight*0.07: 0,
  },
  input: {
    marginLeft: 10,
    flex: 1,
    height:50,
    fontFamily: "MuseoRegular",
  },
});

export default ChatEdit;
