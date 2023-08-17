import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";
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
import { MaterialIcons } from '@expo/vector-icons';
import { categoryProps } from "../../components/Home/Category";

function HomeScreenView() {
  const { loading, refreshing,theme, setLoading } = useStore();
  const [searchArr, setSearchArr] = useState<ItemPropsWithID[] | ItemProps[] |null>(null);
  const [mainArr, setMainArr] = useState<ItemPropsWithID[] | ItemProps[]>([]);
  const [backUpArr, setBackUpArr] = useState<ItemPropsWithID[] | ItemProps[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<categoryProps | null>(null);
  const [type, setType] = useState<number>(0);

  async function fetchData() {
    setLoading(true)
    const data:any = await handleDonationList();
    setMainArr(data?.resultArray);
    setBackUpArr(data?.resultArray);
    setSearchArr(null);
    setSelectedCategory(null)
    setLoading(false)
    setType(0)
  }

  useEffect(() => {
    
    fetchData();
  }, [refreshing]);

  useEffect(() => {
    if (selectedCategory === null) {
      fetchData();
    }
    else {
      setLoading(true);
      const x  = backUpArr.filter(item  => item.category === selectedCategory.category)
      setMainArr(x)
      setLoading(false);
    }
  }, [selectedCategory])
  
  useEffect(() => {
    if (searchArr) {
     setMainArr(searchArr)
     setType(1)
    }


  }, [searchArr, mainArr]);
  
  return (
    <>
      <Header />
      <SearchBar setSearchArr={setSearchArr} />
      <Categories data={categoryArr} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}/>
      {loading ? (
        <Loader />
      ) : (
        <View style={[styles.lowerSection, {backgroundColor: theme === "dark" ? "transaprent": '#f0f0f0'}]}>
          <Text style={styles.title}> {type === 0 ? 
          `${selectedCategory !== null ? selectedCategory?.category: 'All'} Donations close to you `
          : 
          "Search result"
          }</Text>
          {mainArr.length > 0 ? 
          <GridList data={mainArr}/>
          :
          <View style={[styles.noResult, {backgroundColor: theme === "dark" ? "transparent": '#f0f0f0'}]}>
              <MaterialIcons name="search-off" size={100} color="#ccc" />
              {type === 0 ? 
              <Text style={styles.noResultText}>Oops! there are no {selectedCategory !== null ? `${selectedCategory?.category} Donations close to you currently`: "Donations close to you currently"}</Text>
              :
              <Text style={styles.noResultText}>Oops! your search yield no result</Text>
              }
              
              </View>
          }
        
        </View>
      )}
    </>
  );
}
const HomeScreen = Wrapper(HomeScreenView);

export default HomeScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily:'MuseoBold',
    marginBottom:10,
    marginTop:10
  },
  lowerSection:{
    // backgroundColor:'#f0f0f0',
    flex:1
  },
  noResult:{
    justifyContent: 'center',
    alignItems:'center',
    // backgroundColor:'#f0f0f0',
    marginTop:40
  },
  noResultText:{
    fontFamily:'MuseoRegular',
    fontSize:14,
    marginTop:20,
    textAlign:'center',
    color:'#232323'
  }
});
