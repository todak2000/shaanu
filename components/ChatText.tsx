import { Text, TextProps } from "./Themed";
import { StyleSheet, View } from "react-native";
import { useStore } from "../app/store";
import { primaryRed } from "../constants/Colors";

interface chatTextProps extends TextProps {
  message: string;
  messenger: string;
  timestamp: string;
}
export function ChatText(props: chatTextProps) {
  const { userData, theme } = useStore();
  return (
    <View
      style={[
        styles.default,
        {
          backgroundColor:
            userData?.id === props.messenger && theme === "light"
              ? "#E7FFDB"
              : userData?.id === props.messenger && theme === "dark"
              ? primaryRed
              : userData?.id !== props.messenger && theme === "dark"
              ? "#ffffff30"
              : userData?.id !== props.messenger && theme === "light"
              ? "#F8F8FA"
              : "",
          marginLeft: userData?.id === props.messenger ? 20 : 0,
          marginRight: userData?.id === props.messenger ? 0 : 20,
        },
      ]}
    >
      <Text
        {...props}
        style={[
          props.style,
          {
            fontFamily: "MuseoRegular",
            fontSize: 12,
            textAlign: userData?.id === props.messenger ? "left" : "right",
          },
        ]}
      >
        {props.message}
      </Text>
      <Text
        style={[
          {
            fontFamily: "Museo",
            fontSize: 10,
            textAlign: userData?.id === props.messenger ? "left" : "right",
          },
        ]}
      >
        {props.timestamp}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  default: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
});
