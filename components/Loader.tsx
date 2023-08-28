import React from "react";
import { StyleSheet, View } from "react-native";
import { primaryYellow } from "../constants/Colors";
import AnimatedLoader from "./AnimatedLoader";

const Loader = () => {
  return (
    <View style={styles.container}>
      <AnimatedLoader duration={700} colors={[primaryYellow, primaryYellow]} />
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

export default Loader;
