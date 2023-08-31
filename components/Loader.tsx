import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { primaryYellow } from "../constants/Colors";
// import AnimatedLoader from "./AnimatedLoader";
// import { ActivityIndicator } from "react-native";
const Loader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={primaryYellow} />
      {/* <AnimatedLoader duration={700} colors={[primaryYellow, primaryYellow]} /> */}
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
