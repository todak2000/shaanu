import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons  } from '@expo/vector-icons';

interface GridItem {
  id: string;
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
    backgroundColor:"#fff",
    justifyContent:"space-between",
  },
  item: {
    width: '49%',
    borderRadius:10,
    marginBottom: 10,
    
  },
  imageContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
  textContainer:{
    padding: 10,
  },
  name:{
    fontFamily:"MuseoBold",
    fontSize: 14,
    marginTop:-10
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
  return (
    <ScrollView>
      <View style={styles.container}>
        {data.map((item) => (
        <TouchableOpacity onPress={()=>console.log(item)} key={item.id}>
          <View  style={styles.item}>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.imageContainer}>
              <Image
                    source={{ uri: item.imageUrl[0] }}
                    style={styles.image}
                  />
                {/* {item.imageUrl.map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    style={styles.image}
                  />
                ))} */}
              </View>
            </ScrollView>
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
          </TouchableOpacity>
        ))}
        
      </View>
    </ScrollView>
  );
};

export default GridList;
