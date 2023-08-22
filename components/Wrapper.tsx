import React, { useCallback } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useStore } from "../app/store";
interface WithRefreshControlProps {
  children: React.ReactNode;
}

const Wrapper = (
  WrappedComponent: React.ComponentType<WithRefreshControlProps>
) => {
  const WithRefreshControl = ({ children }: WithRefreshControlProps) => {
    const { onRefresh, refreshing, theme } = useStore();
    
    const onRefreshCallBack = useCallback(() => {
      onRefresh();
    }, []);

    const onSwipeDown = (event:any) => {
      console.log(event.nativeEvent.contentOffset.y);
      if (event.nativeEvent.contentOffset.y < 0) { // you can replace zero with needed threshold
        onRefreshCallBack(); //your refresh function
        console.log("refere")
      }
    };
    return (
      <SafeAreaView style={[styles.safeContainer, { backgroundColor: theme === "dark" ? "transparent" : "#fff" }]}>
        <ScrollView
          contentContainerStyle={styles.container}
          bounces={true}
          onScroll={onSwipeDown}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              progressViewOffset={50}
              onRefresh={onRefreshCallBack}
            />
          }
        >
          <WrappedComponent>{children}</WrappedComponent>
        </ScrollView>
      </SafeAreaView>
    );
  };

  return WithRefreshControl;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeContainer: {
    flex: 1,
  },
});

export default Wrapper;
