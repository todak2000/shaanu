/* eslint-disable @typescript-eslint/explicit-function-return-type */
import AsyncStorage from '@react-native-async-storage/async-storage'

export const saveLocalItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (error) {
    console.log(error)
  }
}

export const getLocalItem = async (key: string) => {
  try {
    const token = await AsyncStorage.getItem(key)
    return token
  } catch (error) {
    console.log(error)
    return null
  }
}
export const removeLocalItem = async () => {
  try {
    await AsyncStorage.clear()
  } catch (error) {
    console.log(error)
  }
}
