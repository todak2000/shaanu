import React, { useState, useEffect } from 'react';
import { FlatList, Image, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { initializeApp } from 'firebase/app';
import { collection, DocumentData, query, where, orderBy, limit, startAfter, getDocs, } from 'firebase/firestore';
import { db, app } from '../app/db/firebase';
type Item = {
    id: string;
    category: string;
    name: string;
    imageUrl: string[];
    pickupAddress: string;
    donor: string;
    status: string;
    reciever: string;
    location: string;
    interestedParties: string[];
};

const wait = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const InfiniteScrollExampleWithFirebaseData: React.FC = () => {
  const [data, setData] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null);

  useEffect(() => {
    if (app) {
        fetchData(); 
    }
   else{console.log("firebase isses")}
   
    
  }, []);

  const fetchData = async (afterDoc?: DocumentData | null) => {
    try {
      const boardDB = collection(db, "Inventory");
      let searchQuery = query(boardDB, where("status", "==", 'Available'), orderBy('__name__'), limit(10));
      if (afterDoc) {
        searchQuery = query(searchQuery, startAfter(afterDoc));
      }
      const snapshot = await getDocs(searchQuery);
      if (!snapshot.empty) {
        setData(prevData => [
          ...prevData,
          ...snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item)),
        ]);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setData([]);
    setLastDoc(null);
    fetchData();
    wait(2000).then(() => setRefreshing(false));
  };

  const loadMoreData = () => {
    if (!loadingMore && lastDoc) {
      setLoadingMore(true);
      fetchData(lastDoc);
      wait(2000).then(() => setLoadingMore(false));
    }
  };

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.title}>{item.name}</Text>
          <Image style={styles.image} source={{ uri:item.imageUrl[0] }} />
          <Text>Category:{item.category}</Text>
          <Text>Pickup Address:{item.pickupAddress}</Text>
          <Text>Donor:{item.donor}</Text>
          <Text>Status:{item.status}</Text>
          <Text>Reciever:{item.reciever}</Text>
          <Text>Location:{item.location}</Text>
          <Text>Interested Parties:{item.interestedParties.join(', ')}</Text>
        </View>
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          progressViewOffset={50}
        />
      }
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.loadingMore}>
            <Text>Loading more...</Text>
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
 item:{
   paddingVertical :10,
   paddingHorizontal :20,
   borderBottomWidth :1,
   borderBottomColor :'#ccc'
 },
 title:{
   fontSize :18,
   fontWeight :'bold'
 },
 image:{
   width :150,
   height :150,
   marginVertical :10
 },
 loadingMore:{
   padding :16,
   alignItems :'center'
 }
});

export default InfiniteScrollExampleWithFirebaseData;
