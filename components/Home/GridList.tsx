import React, {useEffect, useState, useCallback} from 'react';
import { View, Text, FlatList, Pressable, RefreshControl, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons  } from '@expo/vector-icons';
import { useStore } from '../../app/store';
import { DocumentData} from 'firebase/firestore';
import { primaryYellow } from '../../constants/Colors';
export interface GridItem {
  id?: string;
  name: string;
  imageUrl: string[];
  category: string;
  donor: string;
  status: string;
  location: string;
  interestedParties: string[];
}

interface GridListProps {
  data: GridItem[];
  lastDoc: DocumentData | null;
  setData: React.Dispatch<React.SetStateAction<GridItem[]>>;
  setLastDoc: React.Dispatch<React.SetStateAction<DocumentData|null>>;
  fetchData:(data?:DocumentData)=>void;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
    justifyContent:"space-between",
  },
  loadingMore:{
    padding :16,
    alignItems :'center'
  },
  item: {
    borderRadius:10,
    marginBottom: 10,
    
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
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

const wait = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const GridList = ({ data, lastDoc, setData, setLastDoc,fetchData }: GridListProps) => {
    const {theme} = useStore();
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const onRefresh = () => {
      setRefreshing(true);
      setData([]);
      setLastDoc(null);
      fetchData();
      wait(2000).then(() => setRefreshing(false));
    };
  
    const onRefreshCallBack = useCallback(() => {
      onRefresh();
    }, []);

    const loadMoreData = () => {
      if (!loadingMore && lastDoc) {
        setLoadingMore(true);
        fetchData(lastDoc);
        wait(2000).then(() => setLoadingMore(false));
      }
    };

    const handleDetails = (item:any) => {
      console.log(item)
    }
  return (
    <FlatList
    style={{marginBottom:20}}
      showsVerticalScrollIndicator={false}
      data={data}
      keyExtractor={(item:any) => item.id}
      renderItem={({ item }) => (
          <Pressable onPress={()=>handleDetails(item)}  key={item.id} style={[styles.item, {backgroundColor: theme === "dark" ? "#ccc": '#f0f0f0', shadowColor: theme === "dark" ? "#fff": '#000'}]}>
            
           
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
          </Pressable>
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefreshCallBack}
          // progressViewOffset={50}
        />
      }
      onEndReached={data.length > 1 ? loadMoreData: null}
      onEndReachedThreshold={0.05}
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.loadingMore}>
            <Text>Loading more...</Text>
          </View>
        ) : null
      }
    />

  );
};

export default GridList;
