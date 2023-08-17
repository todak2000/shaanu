import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { primaryYellow, primaryRed } from '../../constants/Colors';
import { useStore } from '../../app/store';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    overflow: 'hidden',
    height: 80,
    marginBottom: 20
  },
  item: {
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent:'center',
    borderRadius:40,
    // backgroundColor: "#E5E5E5",
    width: 80
  },
  activeItem:{
    backgroundColor: primaryYellow,
  },
  text:{
    fontFamily:"MuseoRegular",
    fontSize:11,
    color:primaryRed,
  },
  activeText:{
    color:"#fff",
  },
  mainText:{
    fontFamily:"MuseoBold",
    fontSize:18,
    marginBottom:10,

  }
});
export type categoryProps = {
    id: string;
    icon: any;
    category: string;
}

export type dataProps = {
    data: categoryProps[];
    selectedCategory: categoryProps | null;
    setSelectedCategory: React.Dispatch<React.SetStateAction<categoryProps | null>>
}
const Categories = ({ data, setSelectedCategory, selectedCategory }: dataProps) => {
   const {theme} = useStore();

  return (
    <View>
    <Text style={styles.mainText}>Categories</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      
      <View style={styles.container}>
        {data.map((item) => (
            <TouchableOpacity style={selectedCategory?.category === item.category ? [styles.item, styles.activeItem]: [styles.item, {backgroundColor: theme === "dark" ? "#ffffff10": '#E5E5E5'}]} onPress={()=>setSelectedCategory(item)} key={item.id}>
            <>{item.icon}</>
            <Text style={styles.text}>{item.category}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
    </ScrollView>
    </View>
  );
};

export default Categories;
