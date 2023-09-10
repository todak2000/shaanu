import React, { useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import Button from "../../components/Button";
import { Formik, FormikHelpers } from "formik";
import CustomTextInput from "../../components/TextInput";
import { useStore } from "../store";
import { handleSignInAuth } from "../db/apis";
import { SigninSchema } from "../utils/yup";
import { primaryRed, primaryYellow } from "../../constants/Colors";
interface FormValues {
  email: string;
  password: string;
}

const SigninForm = ({
  setScreen,
}: {
  setScreen: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { setExpoPushToken, loading, setLoading, setUserData, userData, theme, showAlert, setAlertMessage,setAlertTitle, isRegistered } = useStore();

  useEffect(() => {
    if (isRegistered) {
      setScreen(0);
    }

  });
  
  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    setLoading(true);
    actions.setSubmitting(false);
  
    // const timeoutPromise = new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     setLoading(false)
    //     reject(new Error("Oops! Something went wrong"));
    //   }, 10000);
    // });
  
    // const signInPromise = handleSignInAuth(values);
  
    try {
      const res: any  = await handleSignInAuth(values)
      console.log(res, 'sdsdsds')
      // const res: any = await Promise.race([timeoutPromise, signInPromise]);
      setLoading(false);
      if (res?.statusCode === 200 && res?.userData?.isVerified) {
        setUserData(res?.userData);
        setExpoPushToken(res?.userData.expoPushToken)
      } else if (res?.statusCode === 200 && !res?.userData?.isVerified) {
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
        // console.log(res, "unknonw")
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
      
      <Formik
        // initialValues={{ password: "daniel12345", email: "todak2000@gmail.com" }}
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
              isLoading={loading}
              theme={theme}
            />
          </View>
        )}
      </Formik>

      <TouchableOpacity onPress={() => setScreen(2)}>
        <Text style={styles.redirect}>
          Yet to register? <Text style={styles.yellow}>Sign up Here</Text>
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setScreen(3)}>
        <Text style={styles.redirect}>
          Forgot your password? <Text style={styles.yellow}>Reset it here</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SigninForm;

const styles = StyleSheet.create({
  container: {
    width: "90%",
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
    color: "#232323",
    fontFamily: "MuseoRegular",
  },
  yellow: {
    color: primaryRed,
  },
});
