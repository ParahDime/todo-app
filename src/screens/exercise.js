import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { FlatList, Text, View, StyleSheet, Button, TouchableOpacity, Modal, Pressable } from 'react-native';
import Header from '../components/Header'
import ItemDetailScreen from '../components/itemDetails';

const Stack = createStackNavigator();

export default function Exercise() {
  
  //const variable to store items
  const [items, setItems] = useState({
    activities: [],
    blank: [],
    food: [],
  });
  
  const [selectedItem, setSelectedItem] = useState(null);  // Track selected item
  const [modalVisible, setModalVisible] = useState(false); // Control modal visibility

   // Helper function to handle reordering
   const reorderItems = (updatedItems) => {
    // Move completed items to the bottom while keeping their original order.
    return updatedItems
      .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
  };

  //helper function to add items to the list
  const handleAddItem = (screen, itemName) => {
    if (itemName) {
      setItems((prevItems) => {
        const updatedItems = {
          ...prevItems,
          [screen]: [...prevItems[screen], { name: itemName, id: Date.now(), completed: false }],
        };
        return {
          ...updatedItems,
          [screen]: reorderItems(updatedItems[screen]),
        };
      });
    }
  };

  const handleToggleCompletion = (itemId) => {
    setItems((prevItems) => {
      const updatedActivities = prevItems.activities.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );

      return {
        ...prevItems,
        activities: reorderItems(updatedActivities),  // Reorder list after update
      };
    });
  };

  const handleLongPress = (item) => {
    setSelectedItem(item);  // Set the selected item details
    setModalVisible(true);  // Show the modal
  };

  const handleCloseModal = () => {
    setModalVisible(false);  // Close the modal
  };


  return (
    <View style={styles.container}>     
      <Header onAddItem={handleAddItem} />
      <View style={styles.flatListContainer}>
      <FlatList
          data={items.activities}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.itemContainer,
                item.completed ? styles.completedItem : null, // Apply green background if completed
              ]}
            >
              <TouchableOpacity
              style={[styles.itemContainer, item.completed ? styles.completedItem : null]}
              onPress={() => handleToggleCompletion(item.id)}
              onLongPress={() => handleLongPress(item)}  // Handle long press
            >

            
              <Text style={styles.itemNumber}>{index + 1}</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Button
                title={item.completed ? '✔️' : '❌'}
                onPress={() => handleToggleCompletion(item.id)}
              />
              </TouchableOpacity>
        </View>

        
    )}
    keyExtractor={(item) => item.id.toString()}
    contentContainerStyle={items.activities.length === 0 ? styles.emptyList : {}}
    ListEmptyComponent={<Text>No items to display</Text>}
/>
      </View>

      {/* Modal to display item details */}
      {selectedItem && (
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {/* Item Number and Name at the top */}
            <Text style={styles.modalNumber}>#{selectedItem.id}</Text>
            <Text style={styles.modalName}>{selectedItem.name}</Text>

            {/* Description Box */}
            <View style={styles.descriptionBox}>
              <TextInput
                style={styles.descriptionText}
                multiline={true}
                onChangeText={setPersistentDescription}
                value={persistentDescription}
              />
            </View>

            {/* Numbers 1 and 2 */}
            <View style={styles.numbersContainer}>
              <Text style={styles.modalNumberText}>{selectedItem.number1}</Text>
              <Text style={styles.modalNumberText}>{selectedItem.number2}</Text>
            </View>

            <Pressable style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      )}
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
  backgroundColor: '#6ff', // Optional: background color for items
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
},
completedItem: {
  backgroundColor: 'green',  // Green background for completed items
},
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalView: {
  width: '75%',
  height: '75%',
  padding: 20,
  backgroundColor: 'white',
  borderRadius: 10,
  alignItems: 'flex-start',
  justifyContent: 'space-between'
},
modalNumber: {
  fontSize: 24,
  fontWeight: 'bold',
  position: 'absolute',
  top: 10,
  bottom: 10
},
modalName: {
  fontSize: 24,
  marginBottom: 15,
  position: 'absolute',
  top: 40,
  left: 10,
},
descriptionBox: {
  width: '95%',
  height: '50%',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  padding: 10,
  marginTop: 70
},  
descriptionText: {
  fontSize: 16,
  textAlignVertical: 'top',
},
numbersContainer: {
  alignItems: center,
  marginTop: 20,
},
modalNumberText: {
  fontSize: 24,
  marginBottom: 10,
  textAlign: 'center'
},
closeButton: {
  marginTop: 20,
  paddingVertical: 10,
  paddingHorizontal: 20,
  backgroundColor: '#2196F3',
  borderRadius: 5,
},
closeButtonText: {
  color: 'white',
  fontSize: 16,
},
});