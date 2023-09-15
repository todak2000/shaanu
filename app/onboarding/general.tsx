import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Button from "../../components/Button";
import { Text, View } from "../../components/Themed";
import { useStore } from "../store";
import { primaryRed, primaryYellow } from "../../constants/Colors";
import { router } from "expo-router";
import { getLocalItem } from "../utils/localStorage";
import CustomAlert from "../../components/CustomAlert";
import Logo from "../../assets/images/svgs/logo";

const GeneralScreen = () => {
  const { alertVisible, hideAlert, alertTitle, alertMessage, theme } = useStore();
const [name, setName] = useState('')
  useEffect(() => {
    getLocalItem('isLogedIn').then((islogin)=> {
      if (islogin === 'false') {
        router.push('/onboarding/signin')
      }
      
    })
    .catch((error)=> console.log(error))
    getLocalItem('userData').then((data)=> {
      const userData = JSON.parse(data as string);
      setName(userData.firstname)
      
    })
    .catch((error)=> console.log(error))
  }, [])

  const handleRedirect = () => {
    router.push("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <CustomAlert
          title={alertTitle}
          message={alertMessage}
          visible={alertVisible}
          onClose={hideAlert}
        />
          <Logo color={primaryYellow} />
          <Text style={styles.title}>
        Welcome Back!{" "}
        <Text style={{ color: primaryYellow, fontFamily: "MuseoBold" }}>
          {name}
        </Text>
      </Text>
      <View style={styles.form}>
      
      <Button
        onPress={handleRedirect}
        title="Continue"
        icon={false}
        color={theme === "dark" ? primaryYellow : "black"}
        // isLoading={loading}
        theme={theme}
      />
      </View>
    </View>
  );
};

export default GeneralScreen;

const styles = StyleSheet.create({
  form: {
    width: '90%',
    height: "20%",
    marginTop: 100
  },
  container: {
    flex: 1,
    alignItems: "center",
    width: '100%',
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "MuseoBold",
  },
  subTitle: {
    color: primaryRed,
    fontSize: 13,
    marginBottom: 20,
    fontFamily: "MuseoRegular",
  },

  yellow: {
    color: primaryRed,
  },
});
