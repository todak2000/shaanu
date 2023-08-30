import { StyleSheet } from "react-native";
import Logo from "../../assets/images/svgs/logo";
import { useState, useEffect } from "react";
import { Text, View } from "../../components/Themed";
import ResetForm from "./reset";
import SignupForm from "./signup";
import SigninForm from "./signin";
import { primaryRed, primaryYellow } from "../../constants/Colors";
import GeneralScreen from "./general";
import { useStore } from "../store";
import { wait } from "../utils";
import StaticLoader from "../../components/StaticLoader";

export default function OnboardingScreen() {
  const [screen, setScreen] = useState<number>(6);
  const [title, setTitle] = useState<string>("Sign In");
  const [subTitle, setSubTitle] = useState<string>("Welcome Back!");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isRegistered } = useStore();

  useEffect(() => {
    if (isRegistered) {
      setScreen(0);
    } else if (!isRegistered && screen === 6) {
      wait(100).then(() => {
        setScreen(1);
        setIsLoading(false);
      });
    } else {
      wait(100).then(() => {
        setScreen(screen | 1);
        setIsLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    switch (screen) {
      case 1:
        setTitle("Sign In");
        setSubTitle("Welcome Back!");
        break;
      case 2:
        setTitle("Sign Up");
        setSubTitle("Please get started already!");
        break;
      case 3:
        setTitle("Reset Password");
        setSubTitle("Lets get back onboard!");
        break;
    }
  }, [screen]);

  return (
    <>
      {isLoading ? (
        <StaticLoader />
      ) : (
        <View style={styles.container}>
          <Logo color={primaryYellow} />
          {screen !== 0 && (
            <>
              <Text style={styles.title}>{title} </Text>
              <Text style={styles.subTitle}>{subTitle}</Text>
            </>
          )}
          {screen === 0 && <GeneralScreen setScreen={setScreen} />}
          {screen === 1 && <SigninForm setScreen={setScreen} />}
          {screen === 2 && <SignupForm setScreen={setScreen} />}
          {screen === 3 && <ResetForm setScreen={setScreen} />}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
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
});
