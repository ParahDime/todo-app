import React, { createContext, useState } from 'react';
import RNFS from 'react-native-fs'; // or 'expo-file-system'

const GlobalContext = createContext(); //create variable for global use

const GlobalProvider = ({ children }) => { //provide global variable
  const jsonFilePath = `${RNFS.DocumentDirectoryPath}../screens/items.json`; //call file path

  //variables to store items for screen
  const [items, setItems] = useState({ 
    activities: [], //activities src
    planner: [], //planner
    food: [] //food
  });

  // Function to read data from JSON file (async)
  const readItemsFromFile = async () => {
    try {
      const fileExists = await RNFS.exists(jsonFilePath);
      if (fileExists) { //if the file exists
        const data = await RNFS.readFile(jsonFilePath); //read the data
        setItems(JSON.parse(data)); //set items to the page
      }
    } catch (error) { //if cannot read
      console.log("Error reading JSON file", error);
    }
  };

  // Function to write data to JSON file
  const writeItemsToFile = async (updatedItems) => {
    try {
      await RNFS.writeFile(jsonFilePath, JSON.stringify(updatedItems));
    } catch (error) {
      console.log("Error writing to JSON file", error);
    }
  };

  // Load items from file when the app starts
  useEffect(() => {
    readItemsFromFile();
  }, []);

  // Save items to file whenever they change
  useEffect(() => {
    writeItemsToFile(items);
  }, [items]);

  //return items as variables when calleed
  return (      
    <GlobalContext.Provider value={{ items, setItems }}> 
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalProvider, GlobalContext };