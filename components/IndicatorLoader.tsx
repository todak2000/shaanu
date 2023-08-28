import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { primaryYellow } from "../constants/Colors";

const IndicatorLoader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={primaryYellow} />
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

export default IndicatorLoader;
