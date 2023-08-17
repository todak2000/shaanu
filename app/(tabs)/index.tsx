import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Text } from "../../components/Themed";
import { useStore } from "../store";
import Header from "../../components/Home/Header";
import SearchBar from "../../components/Home/Search";
import { ItemProps } from "../db/apis";
import Loader from "../../components/Loader";
import Wrapper from "../../components/Wrapper";

function HomeScreenView() {
  const { loading, refreshing } = useStore();
  const [searchArr, setSearchArr] = useState<ItemProps[] | null>(null);

  useEffect(() => {
    setSearchArr(null);
  }, [refreshing]);

  return (
    <>
      <Header />
      <SearchBar setSearchArr={setSearchArr} />
      {loading ? (
        <Loader />
      ) : (
        <>
          {searchArr !== null ? (
            <Text style={styles.title}>Search result</Text>
          ) : (
            <Text style={styles.title}>Home Screen</Text>
          )}
        </>
      )}
    </>
  );
}
const HomeScreen = Wrapper(HomeScreenView);

export default HomeScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
