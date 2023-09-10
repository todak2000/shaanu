import React, { useState } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useStore } from "../app/store";
interface CustomTextInputProps extends TextInputProps {
  customStyle?: object;
  isPassword?: boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  customStyle,
  isPassword,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useStore();
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.default,
          customStyle,
          {
            color: theme === "dark" ? "#ccc" : "#232323",
            backgroundColor: theme === "dark" ? "#232323" : "#F8F8FA",
          },
        ]}
        secureTextEntry={isPassword && !showPassword}
        {...props}
        placeholderTextColor={theme === "dark" ? "#ffffff30" : "gray"}
      />
      {isPassword && (
        <TouchableOpacity onPress={handleTogglePassword} style={styles.icon}>
          <MaterialIcons
            name={showPassword ? "visibility" : "visibility-off"}
            color="#ccc"
            size={30}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  default: {
    flex: 1,
    height: 55,
    padding: 10,
    borderColor: "transparent",
    borderWidth: 0.5,
    borderRadius: 3,
    marginBottom: 10,
    fontFamily: "MuseoRegular",
  },
  icon: {
    position: "absolute",
    right: 20,
    top: 13,
  },
});

export default CustomTextInput;
