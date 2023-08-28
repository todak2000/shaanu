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
  const { loading, theme, setLoading, userData } = useStore();

  useEffect(() => {
    if (userData?.id) {
      setScreen(0);
    } else {
      setScreen(3);
    }
  });

  const handleSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    setLoading(true);
    actions.setSubmitting(false);
    handlePasswordReset(values).then((res) => {
      if (res === 200) {
        Alert.alert("Password reset link has been sent to your email");
      } else if (res === 404) {
        Alert.alert(
          "Oops! The email does not exist in our databse. Please Signup"
        );
      } else {
        Alert.alert("Oops! an error occurred");
      }
      setLoading(false);
    });
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
              isLoading={loading}
              theme={theme}
            />
          </View>
        )}
      </Formik>

      <TouchableOpacity onPress={() => setScreen(1)} style={styles.touch}>
        <Ionicons name="arrow-back-circle-outline" size={20} color="black" />
        <Text style={styles.redirect}>
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
    color: "#232323",
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
