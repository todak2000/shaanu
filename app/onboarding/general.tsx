import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Button from "../../components/Button";
import { Text } from "../../components/Themed";
import { useStore } from "../store";
import { primaryRed, primaryYellow } from "../../constants/Colors";
import { router } from "expo-router";

const GeneralScreen = ({
  setScreen,
}: {
  setScreen: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { loading, theme, userData } = useStore();

  useEffect(() => {
    if (userData?.id) {
      setScreen(0);
    } else {
      setScreen(1);
    }
  });

  const handleRedirect = () => {
    router.push("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome Back!{" "}
        <Text style={{ color: primaryYellow, fontFamily: "MuseoBold" }}>
          {userData?.firstname}
        </Text>
      </Text>
      <Button
        onPress={handleRedirect}
        title="Continue"
        icon={false}
        color={theme === "dark" ? primaryYellow : "black"}
        isLoading={loading}
        theme={theme}
      />
    </View>
  );
};

export default GeneralScreen;

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: "20%",
  },
  title: {
    fontSize: 20,
    marginTop: 10,
    textAlign: "center",
    marginBottom: 80,
    fontFamily: "MuseoRegular",
  },
  yellow: {
    color: primaryRed,
  },
});
