import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons  } from '@expo/vector-icons';
import { useStore } from '../../app/store';

interface GridItem {
  id?: string;
  name: string;
  imageUrl: string[];
  donor: string;
  status: string;
  location: string;
  interestedParties: string[];
}

interface GridListProps {
  data: GridItem[];
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
    // backgroundColor:"#f0f0f0",
    justifyContent:"space-between",
  },
  item: {
    borderRadius:10,
    marginBottom: 10,
    backgroundColor:"#fff",
  },
  imageContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius:10,
  },
  textContainer:{
    padding: 10,
  },
  name:{
    fontFamily:"MuseoBold",
    fontSize: 14,
    marginTop:-5
  },
  textNormal:{
    fontFamily:"MuseoRegular",
    fontSize: 12,
    marginLeft: 3
  },
  statusView:{
    flexDirection: 'row',
    alignItems:'center',
  },
  statusViewTop:{
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-between'
  }
});

const GridList = ({ data }: GridListProps) => {
    const {theme} = useStore();
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={[styles.container, {backgroundColor: theme === "dark" ? "transparent": '#f0f0f0'}]}>
        {data.map((item) => (
          <View key={item.id} style={[styles.item, {backgroundColor: theme === "dark" ? "#ccc": '#fff'}]}>
            
           
              <View style={styles.imageContainer}>
              <Image
                    source={{ uri: item.imageUrl[0] }}
                    style={styles.image}
                  />
              </View>
   
            <View style={styles.textContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.statusViewTop}>
                    <View style={styles.statusView}>
                        
                        <MaterialCommunityIcons name="progress-check" size={20} color="#08B72F" />
                        <Text style={styles.textNormal}>{item.status} </Text>
                    </View>
                    <View style={styles.statusView}>
                        
                        <Ionicons name="ios-location" size={20} color="#ccc" />
                        <Text style={styles.textNormal}>{item.location}</Text>
                    </View>
                </View>
            </View>
          </View>
        ))}
        
      </View>
    </ScrollView>
  );
};

export default GridList;
