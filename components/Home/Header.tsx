
import React, { useState, useEffect } from 'react';
import { View, Text,  StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useStore } from '../../app/store';
import { primaryYellow } from '../../constants/Colors';

const Header: React.FC = () => {
    const [curentLoc, setCurrentLoc] = useState("Searching...");
    const {userData} = useStore();

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.log('Permission to access location was denied')
            return;
          }
          else{
            let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Highest});
            if (location){
                const { latitude , longitude } = location.coords
                let response = await Location.reverseGeocodeAsync({latitude,longitude});
                let fullLoc = response[0].city+", "+response[0].region
                setCurrentLoc(fullLoc)   
            }
          }
        })();
      }, []);

  return (
    <View style={styles.container}>
        
        <View style={styles.left}>
            <FontAwesome5 name="location-arrow" size={15} color={primaryYellow} />
            <Text style={styles.topText}>{curentLoc}</Text>
        </View>
        <View style={styles.left}>
        <MaterialIcons name="person-pin" size={20} color={primaryYellow} />
            <Text style={styles.topText}>Hi {userData?.firstname}!</Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    width:'100%',
    justifyContent:'space-between',
    alignItems:'center',
  },
  left:{
    flexDirection:'row',
    alignItems:'center',
  },
  topText:{
    fontSize: 14,
    marginLeft: 5,
    fontFamily:"MuseoRegular",
  }
 
});

export default Header;
