import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
  StyleSheet,
  Platform,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Button from "../../components/Button";
import { Text } from "../../components/Themed";
import { Formik, Field, FormikHelpers } from "formik";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useStore } from "../store";
import { primaryYellow, primaryRed } from "../../constants/Colors";
import CustomTextInput from "../../components/TextInput";
import { categoryArr } from "../../constants/items";
import { AntDesign } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { TouchableOpacity } from "../../components/Themed";
import { ItemProps, handleDonate, imageProps } from "../db/apis";
import { DonateSchema } from "../utils/yup";
import * as ImageManipulator from "expo-image-manipulator";
import * as Crypto from "expo-crypto";

interface FormValues {
  category: string;
  name: string;
  pickupAddress: string;
}

const title = "Donate";
const imageError = "Kindly add least 1 Image of the item";
const maxHeight = 200;
const maxWidth = 200;
const DonateScreen = () => {
  const [images, setImages] = useState<imageProps[]>([]);
  const [isImageError, setIsImageError] = useState<string>("");
  const [localLoading, setLocalLoading] = useState(false);
  const [isSelect, setIselect] = useState(false);
  const { theme, curentLoc, loading, setLoading, userData } = useStore();

  const resizeImage = async (
    initialUri: string,
    maxWidth: number,
    maxHeight: number
  ) => {
    const result = await ImageManipulator.manipulateAsync(
      initialUri,
      [{ resize: { width: maxWidth, height: maxHeight } }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    return result.uri;
  };

  const pickImage = async () => {
    let result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5 - (images?.length | 0),
    });
    if (!result?.canceled) {
      result.assets.forEach((asset: any) => {
        const assetId = asset.assetId ? asset.assetId : Crypto.randomUUID();
        const fileName = asset.fileName ? asset.fileName : Crypto.randomUUID();
        resizeImage(asset.uri, maxWidth, maxHeight).then((uri) => {
          setImages((prevImages) => [
            ...prevImages,
            { assetId, fileName, uri },
          ]);
        });
      });
    }
  };

  const removeImage = (assetId: string) => {
    console.log(assetId + " removed");
    setImages((prevImages) =>
      prevImages.filter((image) => image.assetId !== assetId)
    );
  };

  const handleSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    if (images.length <= 0 && values.category !== "Cash") {
      setIsImageError(imageError);
    } else {
      setLocalLoading(true);
      setLoading(true);

      const data: ItemProps = {
        category: values?.category ? values?.category : "Others",
        name: values.name,
        imageUrl: images,
        pickupAddress: values.pickupAddress,
        donor: userData?.id || "",
        status: "Available",
        reciever: "",
        location: curentLoc,
        interestedParties: [],
      };
      actions.setSubmitting(false);

      handleDonate(data).then((res) => {
        if (res) {
          Alert.alert(res?.message);
        } else {
          Alert.alert("Oops! an error occurred");
        }
        setLoading(false);
        setImages([]);
        actions.resetForm();
      });
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);
  useEffect(() => {
    if (images.length > 0) {
      setIsImageError("");
    }
  }, [images]);

  return (
    <SafeAreaView
      style={[
        styles.safeContainer,
        { backgroundColor: theme === "dark" ? "transparent" : "#fff" },
      ]}
    >
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: theme === "dark" ? "transparent" : "#fff" },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{title}</Text>
        <Formik
          initialValues={{
            category: "",
            name: "",
            pickupAddress: "",
          }}
          validationSchema={DonateSchema}
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
            <View style={styles.formInner}>
              <Text style={styles.subTitle}>Select Category</Text>
              {Platform.OS === "ios" && (
                <TouchableOpacity
                  style={[
                    styles.iosSelect,
                    {
                      backgroundColor: theme === "dark" ? "#232323" : "#F8F8FA",
                    },
                  ]}
                  onPress={() => setIselect(!isSelect)}
                >
                  <Text
                    style={[
                      {
                        color: theme === "dark" ? "#ccc" : "#232323",
                        fontFamily: "MuseoRegular",
                      },
                    ]}
                  >
                    {values?.category !== ""
                      ? values?.category
                      : "Click to choose a Category"}
                  </Text>
                  <AntDesign
                    name={isSelect ? "caretup" : "caretdown"}
                    size={15}
                    color={theme === "dark" ? "#ccc" : "#232323"}
                  />
                </TouchableOpacity>
              )}
              {isSelect && Platform.OS === "ios" && (
                <Field name="category">
                  {({ field }: any) => (
                    <Picker
                      selectedValue={field.value}
                      onValueChange={field.onChange(field.name)}
                      style={[
                        styles.picker,
                        {
                          color: theme === "dark" ? "#ccc" : "#232323",
                          backgroundColor:
                            theme === "dark" ? "#232323" : "#F8F8FA",
                        },
                      ]}
                    >
                      {categoryArr
                        .filter((i) => i.category !== null)
                        .map(({ id, category }) => (
                          <Picker.Item
                            key={id}
                            label={category as string}
                            value={category}
                          />
                        ))}
                    </Picker>
                  )}
                </Field>
              )}
              {Platform.OS !== "ios" && (
                <Field name="category">
                  {({ field }: any) => (
                    <Picker
                      selectedValue={field.value}
                      onValueChange={field.onChange(field.name)}
                      style={[
                        styles.picker,
                        {
                          color: theme === "dark" ? "#ccc" : "#232323",
                          backgroundColor:
                            theme === "dark" ? "#232323" : "#F8F8FA",
                        },
                      ]}
                    >
                      <Picker.Item
                        label="Click to choose a Category"
                        value="Click to choose a Category"
                      />
                      {categoryArr
                        .filter((i) => i.category !== null)
                        .map(({ id, category }) => (
                          <Picker.Item
                            key={id}
                            label={category as string}
                            value={category}
                          />
                        ))}
                    </Picker>
                  )}
                </Field>
              )}
              <Text style={styles.subTitle}>
                {values.category === "Cash"
                  ? "Amount (N)"
                  : "Donated Item Name"}
              </Text>

              <CustomTextInput
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                placeholder={
                  values.category === "Cash" ? "5000" : "e.g. 10 cups of Rice"
                }
              />
              {errors.name && touched.name && (
                <Text
                  style={[
                    styles.error,
                    { color: theme === "dark" ? primaryYellow : primaryRed },
                  ]}
                >
                  {errors.name}
                </Text>
              )}
              {values.category !== "Cash" && (
                <View style={styles.flex}>
                  <Text style={styles.subTitle}>Donation Item Pictures</Text>

                  <Text
                    style={[
                      styles.supTitle,
                      { color: theme === "dark" ? primaryYellow : primaryRed },
                    ]}
                  >
                    {images.length} of 5 uploaded
                  </Text>
                </View>
              )}
              {values.category !== "Cash" && (
                <>
                  <View style={styles.imageGrid}>
                    {images.length > 0 &&
                      images.map((item) => {
                        return (
                          <View key={item.assetId}>
                            <Pressable
                              style={styles.delete}
                              onPress={() => removeImage(item.assetId)}
                            >
                              <AntDesign
                                name="closecircle"
                                size={24}
                                color="#ccc"
                              />
                            </Pressable>
                            <Image
                              source={{ uri: item.uri }}
                              style={styles.image}
                            />
                          </View>
                        );
                      })}
                  </View>
                  {images.length < 5 && (
                    <Button
                      onPress={() => pickImage()}
                      title="Pick an image"
                      icon={false}
                      color={theme === "dark" ? "#f0f0f0" : "#ccc"}
                      isLoading={localLoading}
                      theme={theme}
                    />
                  )}
                  <View style={{ height: 10, width: 10 }}></View>

                  {isImageError !== "" && (
                    <Text
                      style={[
                        styles.error,
                        {
                          color: theme === "dark" ? primaryYellow : primaryRed,
                        },
                      ]}
                    >
                      {imageError}
                    </Text>
                  )}
                  <Text style={styles.subTitle}>Pickup Address</Text>
                  <CustomTextInput
                    onChangeText={handleChange("pickupAddress")}
                    onBlur={handleBlur("pickupAddress")}
                    value={values.pickupAddress}
                    placeholder="e.g. No 10, Kola Kojo str, Allen Avenue, Ikeja"
                  />

                  {errors.pickupAddress && touched.pickupAddress && (
                    <Text
                      style={[
                        styles.error,
                        {
                          color: theme === "dark" ? primaryYellow : primaryRed,
                        },
                      ]}
                    >
                      {errors.pickupAddress}
                    </Text>
                  )}
                </>
              )}
              <View style={styles.bottom}>
                <Button
                  onPress={() => handleSubmit()}
                  title="Submit"
                  icon={false}
                  color={theme === "dark" ? primaryYellow : "black"}
                  isLoading={loading}
                  theme={theme}
                />
              </View>
              {values.category === "Cash" && (
                <Text
                  style={[
                    styles.warning,
                    { color: theme === "dark" ? primaryYellow : primaryRed },
                  ]}
                >
                  For your information, only selected recipient's account
                  details would be shared, and funds disbursed at your
                  discretion via the Shaanu financial partners. It is important
                  to note that the Shaanu app does not profit from this
                  transaction. Please be aware that we have no control over fees
                  or charges that a financial institution or payment provider
                  may impose.
                </Text>
              )}
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DonateScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: "5%",
  },
  formInner: {
    marginBottom: "40%",
    flex: 1,
  },
  error: {
    fontFamily: "Museo",
    fontSize: 12,
    marginTop: -10,
  },
  warning: {
    fontFamily: "MuseoRegular",
    textAlign: "center",
    marginTop: 40,
    fontSize: 12,
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
  title: {
    fontSize: 18,
    fontFamily: "MuseoBold",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  subTitle: {
    fontSize: 15,
    fontFamily: "MuseoRegular",
    marginBottom: 10,
    marginTop: 10,
  },
  supTitle: {
    fontSize: 10,
    fontFamily: "MuseoBold",
  },
  picker: {
    backgroundColor: "red",
    height: Platform.OS === "ios" ? null : 48,
    padding: 10,
    borderColor: "transparent",
  },
  bottom: {
    position: "absolute",
    bottom: -80,
    width: "100%",
  },
  imageGrid: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
  delete: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1000,
  },
  iosSelect: {
    flex: 1,
    height: 48,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "transparent",
    borderWidth: 0.5,
    borderRadius: 3,
    marginBottom: 10,
    fontFamily: "MuseoRegular",
  },
  icon: {
    position: "absolute",
    right: 20,
    top: 15,
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
