import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "./Themed";
import { primaryRed, primaryYellow } from "../constants/Colors";
import Logo from "../assets/images/svgs/logo";
import { useStore } from "../app/store";

const StaticLoader = () => {
  const { theme } = useStore();

  return (
    <View style={styles.container}>
      <Logo color={primaryYellow} />
      <Text
        style={{
          fontFamily: "Museo",
          color: theme === "dark" ? "#ccc" : primaryRed,
        }}
      >
        Please wait
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StaticLoader;
