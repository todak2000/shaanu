import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useStore } from "../../app/store";
import { primaryYellow } from "../../constants/Colors";

const Header: React.FC = () => {
  const { userData, theme, curentLoc, getLocation } = useStore();

  useEffect(() => {
    if (curentLoc === "Searching...") {
      getLocation();
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Ionicons name="ios-location" size={15} color={primaryYellow} />
        <Text
          style={[
            styles.topText,
            { color: theme === "dark" ? "#ccc" : "black" },
          ]}
        >
          {curentLoc}
        </Text>
      </View>
      <View style={styles.left}>
        <MaterialIcons name="person-pin" size={20} color={primaryYellow} />
        <Text
          style={[
            styles.topText,
            { color: theme === "dark" ? "#ccc" : "black" },
          ]}
        >
          Hi {userData?.firstname}!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  topText: {
    fontSize: 14,
    marginLeft: 5,
    fontFamily: "MuseoRegular",
  },
});

export default Header;
