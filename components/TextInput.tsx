
import React, { useState } from 'react';
import { View, TextInput, TextInputProps, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useStore } from '../app/store';
interface CustomTextInputProps extends TextInputProps {
  customStyle?: object;
  isPassword?: boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({ customStyle, isPassword, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const {theme} = useStore();
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.default, customStyle, {color:theme === "dark" ? "#f0f0f0": 'black'}]}
        secureTextEntry={isPassword && !showPassword}
        {...props}
        // placeholder='hi'
        placeholderTextColor={theme === "dark" ? "#232323": 'black'}
      />
      {isPassword && (
        <TouchableOpacity onPress={handleTogglePassword} style={styles.icon}>
          <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} color="#ccc" size={20} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  default: {
    flex: 1,
    height: 40,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 0.5,
    borderTopWidth:0,
    borderLeftWidth:0,
    borderRightWidth:0,
    marginBottom:10,
    fontFamily:'MuseoRegular'
  },
  icon: {
    position: 'absolute',
    right: 0,
    top:5,
  },
});

export default CustomTextInput;
