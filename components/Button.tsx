import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import Google from "../assets/images/svgs/google";
import Loader from "./Loader";

type Props = {
  onPress: (e: GestureResponderEvent | any) => void;
  title: string;
  icon?: boolean;
  color?: string;
  isLoading?: boolean;
  theme: "light" | "dark";
};

const Button = ({ onPress, title, icon, color, isLoading, theme }: Props) => {
  const dynamicStyles = styles(color, theme);
  return (
    <TouchableOpacity style={[dynamicStyles.button]} onPress={onPress}>
      {isLoading ? (
        <Text style={dynamicStyles.text}>Connecting ...</Text>
      ) : (
        <>
          <Text style={dynamicStyles.text}>{title}</Text>
          {icon && <Google />}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = (color: string | any, theme: "light" | "dark") =>
  StyleSheet.create({
    button: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      paddingVertical: 15,
      paddingHorizontal: 32,
      borderRadius: 3,
      elevation: 3,
      backgroundColor: color || "black",
    },
    text: {
      fontSize: 14,
      lineHeight: 21,
      fontFamily: "MuseoRegular",
      letterSpacing: 0.25,
      color: theme === "light" ? "#FFFFFF" : "#232323",
    },
  });

export default Button;
