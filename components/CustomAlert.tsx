import React from 'react';
import { Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { primaryRed } from '../constants/Colors';
import { useStore } from '../app/store';
import { View, Text } from './Themed';

interface CustomAlertProps {
  title: string;
  message: string;
  visible: boolean;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ title, message, visible, onClose }) => {

    const {theme} = useStore();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, {backgroundColor: theme === "dark" ? "white" :"white"}]}>
          <Text style={[styles.title, {color: theme === "dark" ? "#000" : "#000"}]}>{title}</Text>
          <Text style={[styles.message, {color: theme === "dark" ? "#000" : "#232323"}]}>{message}</Text>
          <TouchableOpacity style={[styles.button, {backgroundColor: primaryRed}]} onPress={onClose}>
            <Text style={[styles.buttonText, {color: theme === "dark" ? "#fff" : "#fff"}]}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  title: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
    fontFamily:'MuseoBold'
  },
  message: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 14,
    fontFamily: 'MuseoRegular'
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 3,
    elevation: 3,
    // elevation: 2,

  },
  buttonText:{
     fontSize :16,
     fontFamily:'MuseoBold'
   }
});

export default CustomAlert;
