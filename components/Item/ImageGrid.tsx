import React, { useState } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useStore } from "../../app/store";
import { primaryYellow } from "../../constants/Colors";
interface ImageGridProps {
  imageUrls: string[];
}

export const ImageGrid: React.FC<ImageGridProps> = ({ imageUrls }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { theme } = useStore();
  const handleScroll = (event: any) => {
    const position = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(position / Dimensions.get("window").width);
    setActiveIndex(currentIndex);
  };

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {imageUrls?.map((url) => (
          <Image key={url} source={{ uri: url }} style={styles.image} />
        ))}
      </ScrollView>
      <View style={styles.indicatorContainer}>
        {imageUrls?.length > 1 &&
          imageUrls?.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === activeIndex
                  ? {
                      backgroundColor:
                        theme === "dark" ? primaryYellow : "black",
                    }
                  : {},
              ]}
            />
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: Dimensions.get("window").width,
    height: 200,
    resizeMode: "cover",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
});
