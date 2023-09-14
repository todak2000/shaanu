import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity} from "react-native";
import Button from "../../components/Button";
import { Formik, FormikHelpers } from "formik";
import CustomTextInput from "../../components/TextInput";
import { useStore } from "../store";
import { handleSignUpAuth } from "../db/apis";
import { SignupSchema } from "../utils/yup";
import { primaryYellow } from "../../constants/Colors";

interface FormValues {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  password: string;
  expoPushToken: string;
  [key: string]: string;
}

const SignupForm = ({
  setScreen,
}: {
  setScreen: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const {
    loading,
    setLoading,
    theme,
    setUserData,
    userData,
    registerForPushNotificationsAsync,
    setExpoPushToken,
    isRegistered,
    setAlertMessage,
    setAlertTitle,
    showAlert,
    authState,
    authDispatch
  } = useStore();

  const [localLoading, setLocalLoading] = useState<boolean>(false)
  useEffect(() => {
    if (authState.isRegistered && authState?.userData?.isVerified) {
      setScreen(0);
    } 
    if (loading) {
      setTimeout(() => {
        setLoading(false)
        setAlertMessage("Oops! an error occurred. Try again")
        setAlertTitle("Network Issues!")
        showAlert()
       
      }, 10000);
    }
  });

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    setScreen(2)
    setLocalLoading(true);
    actions.setSubmitting(false);
  
    try {
      const token  = await registerForPushNotificationsAsync()
      // console.log(token, 'token')

      // setExpoPushToken(token as string);
      values.expoPushToken = token ? token : "";
  
      const res: any = await handleSignUpAuth(values)(authDispatch)
      setLocalLoading(false);
      if (res?.statusCode === 200) {
        setAlertMessage("Welcome! Please check your email to verify your account. Thank you.")
        setAlertTitle("Yah! one more hurdle to cross")
        showAlert()
      } else if (res?.statusCode === 409) {
        setAlertMessage("We're sorry, but the email you entered already exists in our database. Please consider signing in to access your account.")
        setAlertTitle("You have an Account Already!")
        showAlert()
      } else {
        setAlertMessage("Oops! an error occurred.")
        setAlertTitle("Unknown Error!")
        showAlert()
      }
      
      
    } catch (error) {
      setAlertMessage("Oops! an error occurred. Try again")
      setAlertTitle("Network Issues!")
      showAlert()
      setLocalLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          // firstname: "Ola",
          // lastname: "Bade",
          // phoneNumber: "09876563512",
          // password: "dada12345",
          // email: "dada@dada.com",
          // expoPushToken: "",
          firstname: "",
          lastname: "",
          phoneNumber: "",
          password: "",
          email: "",
          expoPushToken: "",
        }}
        validationSchema={SignupSchema}
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
              onChangeText={handleChange("firstname")}
              onBlur={handleBlur("firstname")}
              value={values.firstname}
              placeholder="First Name"
            />
            {errors.firstname && touched.firstname && (
              <Text style={styles.error}>{errors.firstname}</Text>
            )}
            <CustomTextInput
              onChangeText={handleChange("lastname")}
              onBlur={handleBlur("lastname")}
              value={values.lastname}
              placeholder="Last Name"
            />
            {errors.lastname && touched.lastname && (
              <Text style={styles.error}>{errors.lastname}</Text>
            )}
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
              onChangeText={handleChange("phoneNumber")}
              onBlur={handleBlur("phoneNumber")}
              value={values.phoneNumber}
              placeholder="Phone Number"
              maxLength={11}
              keyboardType="numeric"
            />
            {errors.phoneNumber && touched.phoneNumber && (
              <Text style={styles.error}>{errors.phoneNumber}</Text>
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
              title="Sign up"
              icon={false}
              color={theme === "dark" ? primaryYellow : "black"}
              isLoading={authState?.loading || localLoading}
              theme={theme}
            />
          </View>
        )}
      </Formik>

      <TouchableOpacity onPress={() => setScreen(1)}>
      <Text style={[styles.redirect, {color: theme === 'dark' ? '#d0d0d0': '#232323',}]}>
          Already registered? <Text style={styles.yellow}>Sign in Here</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupForm;

const styles = StyleSheet.create({
  container: {
    width: "90%",
  },
  middle: {
    marginTop: 40,
  },
  error: {
    color: "#E15E62",
    fontFamily: "Museo",
    fontSize: 12,
    marginTop: -10,
  },
  redirect: {
    marginTop: 20,
    textAlign: "center",
    fontFamily: "MuseoRegular",
  },
  yellow: {
    color: "#E15E62",
  },
});
