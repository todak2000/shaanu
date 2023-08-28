import React from "react";
import { View, StyleSheet } from "react-native";
import { useStore } from "../../app/store";
import { Text } from "../Themed";

const Card = ({
  icon,
  title,
  value,
}: {
  icon: any;
  title: string;
  value: string | number;
}) => {
  const { theme } = useStore();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#232323" : "#00000009" },
      ]}
    >
      {icon}
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
    width: 150,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "MuseoRegular",
    fontSize: 16,
  },
  value: {
    fontFamily: "MuseoBold",
    fontSize: 24,
  },
});

export default Card;
