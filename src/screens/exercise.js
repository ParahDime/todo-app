import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';

import { FlatList, Text, View, StyleSheet, Button } from 'react-native';
import Header from '../components/Header'
import ItemDetailScreen from '../components/itemDetails';

export default function Exercise() {
  
  const [items, setItems] = useState({
    activities: [],
    blank: [],
    food: [],
  });
  
  const handleAddItem = (screen, itemName) => {
    if (itemName) {
      setItems((prevItems) => ({
        ...prevItems,
        [screen]: [...prevItems[screen], { name: itemName, id: Date.now() }],
      }));
    }
  };

  const handleToggleCompletion = (itemId) => {
    // Update your state to toggle the completed state of the item
    setItems((prevItems) => {
        return {
            ...prevItems,
            activities: prevItems.activities.map(item =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
            ),
        };
    });
};

  return (
    <View style={styles.container}>     
      <Header onAddItem={handleAddItem} />
      <View style={styles.flatListContainer}>
        <FlatList
        style={flex = 1}
          data={items.activities}
          renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
              <Text style={styles.itemNumber}>{index + 1}</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Button 
                  title={item.completed ? "✔️" : "❌"} 
                  onPress={() => handleToggleCompletion(item.id)} 
              />
        </View>
    )}
    keyExtractor={(item) => item.id.toString()}
    contentContainerStyle={items.activities.length === 0 ? styles.emptyList : {}}
    ListEmptyComponent={<Text>No items to display</Text>}
/>
      </View>
      <StatusBar style="auto" />
    </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#gray',
    alignItems: 'center',
    justifyContent: 'flex-start', // Aligns items to the top
},
emptyList: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
},
flatListContainer: {
  flex: 1,
  width: '99%',
  borderWidth: 2,
  borderColor: 'black',
},
noItems: {

},
itemContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  maxHeight: '100px', // Max height of each item
  margin: '1%', // Margin on all sides
  padding: 10,
  borderWidth: 1,
  borderColor: '#ccc', // Optional: border for items
  borderRadius: 5, // Optional: rounded corners
  backgroundColor: '#fff', // Optional: background color for items
},
itemNumber: {
  flex: 0.1, // Space for the number
  textAlign: 'center', // Center the number
},
itemName: {
  fontSize: 18,
    flex: 1,
    marginHorizontal: 10,
},
itemButton: {
  flex: 0.1,
}
});