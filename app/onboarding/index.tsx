import { StyleSheet, Alert } from 'react-native';
import Logo from '../../assets/images/svgs/logo';
import { useState, useEffect } from 'react';
import { Text, View } from '../../components/Themed';
import ResetForm from './reset';
import SignupForm from './signup';
import SigninForm from './signin';
import { primaryRed, primaryYellow } from '../../constants/Colors';

export default function OnboardingScreen() {

const [screen, setScreen] = useState<number>(1)
const [title, setTitle] = useState<string>("Sign In")
const [subTitle, setSubTitle] = useState<string>("Welcome Back!")

useEffect(() => {
  switch (screen) {
    case 1:
      setTitle("Sign In")
      setSubTitle("Welcome Back!")
      break;
    case 2:
      setTitle("Sign Up")
      setSubTitle("Please get started already!")
      break;
    case 3:
      setTitle("Reset Password")
      setSubTitle("Lets get back onboard!")
      break;
    default:
      break;
  }
}, [screen])

  return (
    <View style={styles.container}>
      <Logo color={primaryYellow}/>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subTitle}>{subTitle}</Text>
      {screen === 1 && <SigninForm setScreen={setScreen}/>
      
      }
      {screen === 2 && <SignupForm setScreen={setScreen}/>}
      {screen === 3 && <ResetForm setScreen={setScreen}/>}
      


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily:"MuseoRegular"
  },
  subTitle: {
    color:primaryRed,
    fontSize: 13,
    fontFamily:"MuseoRegular"
  }
});
