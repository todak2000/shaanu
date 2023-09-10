import React, { useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
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
  } = useStore();

  useEffect(() => {
    if (userData?.id) {
      setScreen(0);
    } else {
      setScreen(2);
    }
  });
  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    setLoading(true);
    actions.setSubmitting(false);
    
    const token = await registerForPushNotificationsAsync();
    console.log(token, 'token')

    setExpoPushToken(token as string);
    values.expoPushToken = token;
    handleSignUpAuth(values).then((res) => {
      Alert.alert("Welcome! Please check your email to verify your account. Thank you.");
      if (res?.statusCode === 200) {
        setUserData(res?.userData);
      } else if (res?.statusCode === 409) {
        Alert.alert(
          "We're sorry, but the email you entered already exists in our database. Please consider signing in to access your account."
        );
      } else {
        Alert.alert("Oops! an error occurred");
      }
      setLoading(false);
    });

    // if (token) {
    //   setExpoPushToken(token as string);
    //   values.expoPushToken = token;
    //   handleSignUpAuth(values).then((res) => {
    //     Alert.alert("Welcome! kindly check your email to verify your account");
    //     if (res?.statusCode === 200) {
    //       setUserData(res?.userData);
    //     } else if (res?.statusCode === 409) {
    //       Alert.alert(
    //         "Oops! The email already exist in our databse. Please Signin"
    //       );
    //     } else {
    //       Alert.alert("Oops! an error occurred");
    //     }
    //     setLoading(false);
    //   });
    // }
  };

  return (
    <View style={styles.container}>
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
              isLoading={loading}
              theme={theme}
            />
          </View>
        )}
      </Formik>

      <TouchableOpacity onPress={() => setScreen(1)}>
        <Text style={styles.redirect}>
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
    color: "#232323",
    fontFamily: "MuseoRegular",
  },
  yellow: {
    color: "#E15E62",
  },
});
