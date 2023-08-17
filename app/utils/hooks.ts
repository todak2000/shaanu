import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define a custom hook that takes a key and an initial value as arguments
const useAsyncStorage = (key: string, initialValue: any) => {
  // Define a state variable to store the value associated with the key
  const [storedValue, setStoredValue] = useState(initialValue);

  // Define a function to store a value with the given key
  const setValue = async (value: any) => {
    try {
      // Convert the value to a string before storing it
      const stringValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
      setStoredValue(value);
    } catch (e) {
      // Handle error
    }
  };

  // Use useEffect to retrieve the value from AsyncStorage when the component mounts
  useEffect(() => {
    const getValue = async () => {
      try {
        const stringValue = await AsyncStorage.getItem(key);
        if (stringValue !== null) {
          // Parse the string value back to an object
          const value = JSON.parse(stringValue);
          setStoredValue(value);
        }
      } catch (e) {
        console.log(e)
        // Handle error
      }
    };
    getValue();
  }, [key]);

  // Return the stored value and the setter function
  return [storedValue, setValue];
};

export default useAsyncStorage;
