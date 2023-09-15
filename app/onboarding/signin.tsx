import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Button from "../../components/Button";
import { View, Text } from "../../components/Themed";
import { Formik, FormikHelpers } from "formik";
import CustomTextInput from "../../components/TextInput";
import { useStore } from "../store";
import { handleSignInAuth, handleSignOut } from "../db/apis";
import { SigninSchema } from "../utils/yup";
import { getLocalItem, saveLocalItem } from "../utils/localStorage";
import { primaryRed, primaryYellow } from "../../constants/Colors";
import { useRouter } from "expo-router";
import CustomAlert from "../../components/CustomAlert";
import Logo from "../../assets/images/svgs/logo";
interface FormValues {
  email: string;
  password: string;
}

const SigninForm = () => {
  const router = useRouter()
  const {authDispatch, alertVisible, hideAlert, authState, setIsLogedIn, alertTitle, alertMessage, theme, showAlert, setAlertMessage,setAlertTitle } = useStore();


  useEffect(() => {
    
  }, []);

  useEffect(() => {
    getLocalItem('isLogedIn').then((islogin)=> {
      if (islogin === 'true') {
        router.push('/onboarding/general')
      }
    })
    .catch((error)=> console.log(error))
  }, [])
  
  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    actions.setSubmitting(false);
 
    try {
      const res: any  = await handleSignInAuth(values)(authDispatch)
      console.log(res?.statusCode, 'ress lgoin')
      if (res?.statusCode === 200 && res?.userData?.isVerified ) {
        saveLocalItem('isLogedIn', "true").then(()=>setIsLogedIn(true)).catch(()=>{})
        setIsLogedIn(true)
        router.push('/onboarding/general')
      } else if (res?.statusCode === 200 && !res?.userData?.isVerified) {
        handleSignOut()(authDispatch).then(() => router.push('/onboarding/signin')).catch((err) => {console.log(err)})
        setAlertMessage("Please check your email to verify your account. Thank you.")
        setAlertTitle("Verify your Account!")
        showAlert()
      } else if (res?.statusCode === 404) {
        setAlertMessage("We're sorry, but the email you entered does not exist in our database. Please consider signing up to create an account.")
        setAlertTitle("Wrong Email!")
        showAlert()
      } else if (res?.statusCode === 401) {
        setAlertMessage("Apologies, but the password you entered is incorrect. Please try again.")
        setAlertTitle("Wrong Password")
        showAlert()
        
      } else {
        setAlertMessage("Oops! an error occurred")
        setAlertTitle("Unknown Error!")
        showAlert()
      } 
    } catch (error) {
      setAlertMessage("We’re sorry, but it seems like there are some network issues preventing you from logging in. Please try again in a few moments")
        setAlertTitle("Network Issues!")
        showAlert()
    }
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
          <Text style={styles.title}>Sign In </Text>
              <Text style={styles.subTitle}>Welcome Back!</Text>
      <View style={styles.form}>
      <Formik
        initialValues={{ password: "", email: "" }}
        validationSchema={SigninSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View>
            <CustomTextInput
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email.toLocaleLowerCase()}
              placeholder="Email"
            />
            {errors.email && touched.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}
            <CustomTextInput
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              placeholder="Password"
              isPassword
            />
            {errors.password && touched.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}
            <View style={styles.middle} />
            <Button
              onPress={() => handleSubmit()}
              title="Sign in"
              icon={false}
              color={theme === "dark" ? primaryYellow : "black"}
              isLoading={authState.loading}
              theme={theme}
            />
          </View>
        )}
      </Formik>
      </View>
      <TouchableOpacity onPress={() => router.push('/onboarding/signup')}>
      <Text style={[styles.redirect, {color: theme === 'dark' ? '#d0d0d0': '#232323',}]}>
          Yet to register? <Text style={styles.yellow}>Sign up Here</Text>
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/onboarding/reset')}>
      <Text style={[styles.redirect, {color: theme === 'dark' ? '#d0d0d0': '#232323',}]}>
          Forgot your password? <Text style={styles.yellow}>Reset it here</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SigninForm;

const styles = StyleSheet.create({
  form: {
    width: '90%',
  },
  container: {
    flex: 1,
    alignItems: "center",
    width: '100%',
    justifyContent: "center",
  },
  middle: {
    marginTop: 40,
  },
  error: {
    color: primaryRed,
    fontFamily: "Museo",
    fontSize: 12,
    marginTop: -10,
  },
  redirect: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 16,
    textAlign: "center",
    fontFamily: "MuseoRegular",
  },
  yellow: {
    color: primaryRed,
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
