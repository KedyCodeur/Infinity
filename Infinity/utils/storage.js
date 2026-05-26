import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageSetItem = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error("Async storage writing error :", e, "KEY:", key, "VALUE:", value); 
  }
};

export const storageGetItem = async (key) => {
  const value = await AsyncStorage.getItem(key);
  try {
    return value ? JSON.parse(value) : null;
  } catch (e) {
    await AsyncStorage.removeItem(key); 
    return null;
  }
};


export default {storageGetItem,storageSetItem}

