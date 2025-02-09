import AsyncStorage from "@react-native-async-storage/async-storage";

// Function to store data
export const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
      console.log('Data stored successfully');
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };


  // Function to retrieve data
export const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // console.log('Retrieved data:', value);
        return value;
      } else {
        console.log('No data found for the given key');
        return null;
    }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };
  
  // Function to remove data
 export const removeData = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      console.log('Data removed successfully');
    } catch (error) {
      console.error('Error removing data:', error);
    }
  };