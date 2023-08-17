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
    const { onRefresh, refreshing } = useStore();
    const onRefreshCallBack = useCallback(() => {
      onRefresh();
    }, []);

    return (
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
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
    paddingTop: "5%",
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  safeContainer: {
    flex: 1,
  },
});

export default Wrapper;
