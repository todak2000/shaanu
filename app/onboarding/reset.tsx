import React, { useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import Button from "../../components/Button";
import { Formik, FormikHelpers } from "formik";
import CustomTextInput from "../../components/TextInput";
import { useStore } from "../store";
import { handlePasswordReset } from "../db/apis";
import { ResetSchema } from "../utils/yup";
import { primaryRed, primaryYellow } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

interface FormValues {
  email: string;
}

const ResetForm = ({
  setScreen,
}: {
  setScreen: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { authDispatch, authState, theme, setAlertMessage, setAlertTitle, showAlert } = useStore();

  useEffect(() => {
    if (!authState.isRegistered) {
      setScreen(3);
    } 
  });

  const handleSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    setScreen(3);
    actions.setSubmitting(false);
    handlePasswordReset(values)(authDispatch).then((res) => {
      if (res === 200) {
        setAlertMessage("A password reset link has been sent to your email.")
        setAlertTitle("Reset Password Updates!")
        showAlert()
      } else if (res === 404) {
        setAlertMessage("We’re sorry, but the email you entered does not exist in our database. Please consider signing up to create an account.")
        setAlertTitle("Reset Password Updates!")
        showAlert()
      } else {
        setAlertMessage("Oops! an error occurred")
        setAlertTitle("Unknown Error!")
        showAlert()
      }
    }).catch((error)=>console.log(error));
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={ResetSchema}
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
            <View style={styles.middle} />
            <Button
              onPress={() => handleSubmit()}
              title="Send Email"
              icon={false}
              color={theme === "dark" ? primaryYellow : "black"}
              isLoading={authState.loading}
              theme={theme}
            />
          </View>
        )}
      </Formik>

      <TouchableOpacity onPress={() => setScreen(1)} style={styles.touch}>
        <Ionicons name="arrow-back-circle-outline" size={20} color="black" />
        <Text style={[styles.redirect, {color: theme === 'dark' ? '#d0d0d0': '#232323',}]}>
          {" "}
          Back to <Text style={styles.yellow}>Sign in Here</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetForm;

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
    textAlign: "center",  
    verticalAlign: "middle",
    fontFamily: "MuseoRegular",
  },
  yellow: {
    color: primaryRed,
  },
  touch: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
