import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { primaryRed } from '../constants/Colors';
const Loader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={primaryRed} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;