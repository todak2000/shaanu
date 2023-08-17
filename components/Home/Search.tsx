import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { handleSearch, handleDonate } from '../../app/db/apis';
import { useStore } from '../../app/store';
import { ItemProps } from '../../app/db/apis';

const SearchBar = ({setSearchArr}: {setSearchArr: React.Dispatch<React.SetStateAction<ItemProps[] | null>>}) => {
    const [searchText, setSearchText] = useState<string>('');
const {setLoading} = useStore();

useEffect(() => {
  if (searchText =='') {
    setSearchArr(null)
  }
}, [searchText])

    const updateSearch = async(text: string) => { 
        setSearchText(text);
        setLoading(true)
        await handleSearch(text).then((result: any ) => {
            setLoading(false)
            setSearchArr(result?.searchResultArray)
        });

    }

//   const dat = {
//     category: "Food",
//     name:"Bread Toaster",
//     imageUrl: ["https://picsum.photos/200", "https://picsum.photos/200", "https://picsum.photos/200",],
//     pickupAddress:"No 5, Ade stree, Lagos",
//     donor: "23423232",
//     status: "Available",
//     reciever: "",
//     location:'LA',
//     interestedParties: ["sdsds2323", "dfd45dfg233", "34343sdss"]
// }
//   handleDonate(dat)

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="gray" />
      <TextInput
        style={styles.input}
        value={searchText}
        onChangeText={updateSearch}
        placeholder="Search by Item e.g. Rice"
        clearButtonMode="while-editing"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
    borderRadius: 10,
    padding: 10,
    marginTop:20,
    marginBottom:10
  },
  input: {
    marginLeft: 10,
    flex: 1,
    fontFamily:'MuseoRegular',
  },
});

export default SearchBar;
