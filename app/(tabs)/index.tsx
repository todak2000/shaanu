import { StyleSheet, Pressable } from "react-native";
import { useEffect, useState,  } from "react";
import { Text, View } from "../../components/Themed";
import { useStore } from "../store";
import Header from "../../components/Home/Header";
import SearchBar from "../../components/Home/Search";
import { ItemPropsWithID, ItemProps, handleDonationList } from "../db/apis";
import Loader from "../../components/Loader";
import Wrapper from "../../components/Wrapper";
import Categories from "../../components/Home/Category";
import { categoryArr, itemsArray } from "../../constants/items";
import GridList from "../../components/Home/GridList";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { categoryProps } from "../../components/Home/Category";
import { GridItem } from "../../components/Home/GridList";
import { collection, DocumentData, query, where, orderBy, limit, startAfter, getDocs, } from 'firebase/firestore';
import { db, app } from "../db/firebase";

function HomeScreen() {
  const { loading, theme, onRefresh, setLoading } = useStore();
  const [searchArr, setSearchArr] = useState<ItemPropsWithID[] | ItemProps[] |null>(null);
  // const [mainArr, setMainArr] = useState<ItemPropsWithID[] | ItemProps[]>([]);
  const [backUpArr, setBackUpArr] = useState<GridItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<categoryProps | null>(null);
  const [type, setType] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');

  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null);
  const [data, setData] = useState<GridItem[]>([]);

  const fetchData = async (afterDoc?: DocumentData | null) => {
    setLoading(true)
    setSearchArr(null);
      setSelectedCategory(null)
      setType(0)
      setSearchText('')
    try {
      let searchQuery 
      const boardDB = collection(db, "Inventory");
      if (afterDoc) {
        const initQuery = query(boardDB, where("status", "==", 'Available'), orderBy('__name__'), limit(2));
        searchQuery = query(initQuery, startAfter(afterDoc));
      }
      else{
        searchQuery = query(boardDB, where("status", "==", 'Available'), orderBy('__name__'), limit(2));
      }
      
      const snapshot = await getDocs(searchQuery);

      if (!snapshot.empty) {
        setData(prevData => {
          const uniqueIds = new Set(prevData.map(item => item.id));
          const newData = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as GridItem))
            .filter(item => !uniqueIds.has(item.id));
          return [...prevData, ...newData];
        });
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      }

      
    } catch (error) {
      console.error(error);
    }
    setLoading(false)
  };

  useEffect(() => {
    handleDonationList().then((result: any) => {
      setBackUpArr(result?.resultArray);
    });
  }, []);

  useEffect(() => {
    if (selectedCategory === null) {
      fetchData();
    }
    else {
      setLoading(true);
      const x  = backUpArr?.filter(item  => item?.category === selectedCategory?.category)
      setData(x)
      setLoading(false);
    }
  }, [selectedCategory])

  useEffect(() => {
    if (searchArr) {
      setData(searchArr)
     setType(1)
    }


  }, [searchArr, data]);
  
 

  return (
    <View style={styles.container}>
      <Header />
      <SearchBar setSearchArr={setSearchArr} searchText={searchText} setSearchText={setSearchText}/>
      <Categories data={categoryArr} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}/>
      {loading ? (
        <Loader />
      ) : (
        <View style={styles.lowerSection}>
          <Text style={styles.title}> {type === 0 ? 
          `${selectedCategory !== null ? selectedCategory?.category: 'All'} Donations close to you `
          : 
          searchText !== '' ?
          "Search result" : "All Donations close to you "
          }</Text>
          {data?.length > 0 ? 
          <GridList 
            data={data}
            lastDoc={lastDoc}
            setData={setData}
            setLastDoc={setLastDoc}
            fetchData={fetchData}
          />
          :
          <View style={styles.noResult}>
              <MaterialIcons name="search-off" size={100} color="#ccc" />
              {type === 0 ? 
              <Text style={[styles.noResultText,{color: theme === 'dark' ? '#ccc': "#232323"}]}>Oops! there are no {selectedCategory !== null ? `${selectedCategory?.category} Donations close to you currently`: "Donations close to you currently"}</Text>
              :
              <Text style={[styles.noResultText,{color: theme === 'dark' ? '#ccc': "#232323"}]}>Oops! your search yield no result</Text>
              }
              <Pressable style={styles.refresh} onPress={()=>fetchData()}>
              <MaterialCommunityIcons name="database-refresh" size={20} color="black" />
                <Text style={styles.noResultText}>Refresh</Text>
                </Pressable>
              </View>
          }
        
        </View>
      )}
    </View>
  );
}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "15%",
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily:'MuseoBold',
    marginBottom:10,
    marginTop:10
  },
  lowerSection:{
    backgroundColor:'transparent',
    flex:1
  },
  noResult:{
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'transparent',
    marginTop:40
  },
  noResultText:{
    fontFamily:'MuseoRegular',
    fontSize:14,
    marginLeft:10,
    textAlign:'center',
    color:'#232323'
  },
  refresh:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginTop:20,
    backgroundColor:'#ccc',
    borderRadius:3,
    padding:10,
  }
});
