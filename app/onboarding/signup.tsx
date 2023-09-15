import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity} from "react-native";
import Button from "../../components/Button";
import { Formik, FormikHelpers } from "formik";
import CustomTextInput from "../../components/TextInput";
import { useStore } from "../store";
import { handleSignUpAuth } from "../db/apis";
import { SignupSchema } from "../utils/yup";
import { primaryRed, primaryYellow } from "../../constants/Colors";
import { getLocalItem } from "../utils/localStorage";
import { useRouter } from "expo-router";
import { View, Text } from "../../components/Themed";
import CustomAlert from "../../components/CustomAlert";
import Logo from "../../assets/images/svgs/logo";

interface FormValues {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  password: string;
  expoPushToken: string;
  [key: string]: string;
}

const SignupForm = () => {
  const router = useRouter()
  const {
    theme,
    registerForPushNotificationsAsync,
    setAlertMessage,
    setAlertTitle,
    alertVisible, hideAlert, alertTitle, alertMessage,
    showAlert,
    authState,
    authDispatch
  } = useStore();

  const [localLoading, setLocalLoading] = useState<boolean>(false)
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
    setLocalLoading(true);
    actions.setSubmitting(false);
    

   
    try {
      const token  = await registerForPushNotificationsAsync()
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
      <CustomAlert
          title={alertTitle}
          message={alertMessage}
          visible={alertVisible}
          onClose={hideAlert}
        />
          <Logo color={primaryYellow} />
          <Text style={styles.title}>Sign Up </Text>
              <Text style={styles.subTitle}>Please get started already!</Text>
      <View style={styles.form}>
      <Formik
        initialValues={{
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
      </View>
      <TouchableOpacity onPress={() => router.push('/onboarding/signin')}>
      <Text style={[styles.redirect, {color: theme === 'dark' ? '#d0d0d0': '#232323',}]}>
          Already registered? <Text style={styles.yellow}>Sign in Here</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupForm;

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
