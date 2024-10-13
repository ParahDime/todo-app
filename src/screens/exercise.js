//react imports
import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useContext} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { FlatList, Text, View, StyleSheet, TextInput, Button, TouchableOpacity, Modal, Pressable } from 'react-native';

//import database from '@react-native-firebase/database';

//files imported
import Header from '../components/Header'
import { Feather } from '@expo/vector-icons'

//import functions
import { handleAddItem, setItems } from '../components/functions'


//functions outside of file
const Stack = createStackNavigator();

export default function Exercise() {
  
  //const variable to store items on different screens (move to global)
  const [items, setItems] = useState({
    activities: [],
    blank: [],
    food: [],
  }); 
  
  //const { items, setItems } = useContext(GlobalContext);

  //move to an array (?)
  const [selectedItem, setSelectedItem] = useState(null);  // Track selected item
  const [modalVisible, setModalVisible] = useState(false); // Control if popup modal is visible
  const [persistentDescription, setPersistentDescription] = useState(''); // Store item description
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [editableName, setEditableName] = useState('');  //store name as editable in modal

  const [itemNo1Value, setItemNo1Value] = useState(''); // Values for numbers
  const [itemNo2Value, setItemNo2Value] = useState('');
  
  //lambda function in order to count completed items
  const completedCount = items.activities.filter(item => item.completed).length;
  const totalCount = items.activities.length;

  //Counters that are used to keep track of completed items
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [completedItemsCount, setCompletedItemsCount] = useState(0);
   
  //Function to handle item reordering
   const reorderItems = (updatedItems) => {
    
    return updatedItems
    // Move completed items to the bottom while keeping their original order
      .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
  };

  //Function to add items to the list
  /*const handleAddItem = (screen, itemName) => {
    if (itemName) { //if has characters in the string
      setItems((prevItems) => {
        const updatedItems = { //update the items
          ...prevItems,
          //take the item name, ID is date, autoset to false completion
          [screen]: [...prevItems[screen], { name: itemName, id: Date.now(), completed: false }],
          
        };
        return {
          ...updatedItems,
          [screen]: reorderItems(updatedItems[screen]),
        };
      });
    }
  };*/

  const addItem = (screen, itemName) => {
    handleAddItem(screen, itemName, setItems);
  }

  //Function to remove items from the list
  const handleRemoveItem = (itemId) => {
    setItems((prevItems) => ({
      ...prevItems,
      activities: prevItems.activities.filter(item => item.id !== itemId)  // Remove item by id
    }));

    setItemNo1('');  //reset itemNo to empty or 0
    setItemNo2('');

    //REMOVE ITEMS

    setModalVisible(false);  //close the modal after removing
  };

  //Function to toggle completion
  const handleToggleCompletion = (itemId) => {
    setItems((prevItems) => {
      const updatedActivities = prevItems.activities.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );

      return {
        ...prevItems,
        activities: reorderItems(updatedActivities),  //reorder list after update
      };
    });
  };

  //Function for longPress on an item (opens modal)
  const handleLongPress = (item, index) => {
  setSelectedItem(item);  // Set the selected item details
  setSelectedIndex(index + 1);  // Get the item number
  setPersistentDescription(item.description);  // Set Item description
  setItemNo1Value(itemNo1Value.toString()); // Set the value for numbers
  setItemNo2Value(itemNo2Value.toString());
  setEditableName(item.name); //Set the name (editable)
  setModalVisible(true);  // Show the modal popup
};

  //Function to close nodal
  const handleCloseModal = () => {
    if (selectedItem) {

      //convert number (so is not displayed as NaN)
      const validItemNo1 = itemNo1Value.trim() === '' ? 0 : parseInt(itemNo1Value);
      const validItemNo2 = itemNo2Value.trim() === '' ? 0 : parseInt(itemNo2Value);

      //Update the details of the item
      console.log("confirm");///
      updateItemDetails(selectedItem.id, persistentDescription, editableName, validItemNo1, validItemNo2);
    }
    setModalVisible(false);  //close the modal
  };

  //Update the item details
  const updateItemDetails = (id, desc, name, number1, number2) => {
    // Find the item in your state and update it
    setItems((prevItems) => {
      return {
        ...prevItems,
        activities: prevItems.activities.map((item) =>
          item.id === id ? { ...item, description: desc, name, number1: parseInt(number1), number2: parseInt(number2) } : item
        ),
      };
    });
  };

  //calculates the amount of items completed
  useEffect(() => {
    const totalCount = items.activities.length; // Total number of items
    const completedCount = items.activities.filter(item => item.completed).length; // Completed items
    setTotalItemsCount(totalCount);
    setCompletedItemsCount(completedCount);
  }, [items]);

  //Page layout
  return (
    <View style={styles.container}>     
      <Header onAddItem={addItem} />
      <View style={styles.counterContainer}>
      <Text style={completedCount === totalCount ? styles.completedCounterText : styles.counterText}>
        Items completed: {completedCount}/{totalCount}
      </Text>
      </View>
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
              onLongPress={() => handleLongPress(item, index)}  // Handle long press
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
    ListEmptyComponent={<Text style={styles.noItems}>No items to display</Text>}
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
            <View style={styles.headerModalContainer}>
            <Text style={styles.modalNumber}>#{selectedIndex}</Text>
            <TouchableOpacity 
              onPress={() => handleRemoveItem(selectedItem.id)}  // Call remove function
              style={styles.removeButtonContainer}
              >
              <Feather name="trash-2" size={24} color="red" />
              </TouchableOpacity>

            </View>
            <View style={styles.nameModalContainer}>
              <TextInput 
                style={styles.modalName}
                value={editableName}
                onChangeText={setEditableName}
              />
            </View>

            {/* Description Box */}
            <View style={styles.descriptionBox}>
              <TextInput
                style={styles.descriptionText}
                placeholder="Description of exercise"
                multiline={true}
                numberOfLines={4}
                onChangeText={setPersistentDescription}
                value={persistentDescription}
              />
            </View>

            {/* Numbers 1 and 2 */}
            <View style={styles.numbersContainer}>
              <View style={styles.ModalTextContainer}>
              <Text style={styles.modalNumberText}>Reps: </Text>
              <TextInput
                    style={styles.numberInput}
                    keyboardType="numeric"
                    onChangeText={setItemNo1Value}
                    value={itemNo1Value}
                  />
              </View>
              <View style={styles.ModalTextContainer}>
              <Text style={styles.modalNumberText}>Sets: </Text>
              <TextInput
                    style={styles.numberInput}
                    keyboardType="numeric"
                    onChangeText={setItemNo2Value}
                    value={itemNo2Value}
                  />
              </View>
            </View>

            <Pressable style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>Save & Close</Text>
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
    //justifyContent: 'flex-start', // Aligns items to the top
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
counterText: {
  fontSize: 18,
},
completedCounterText: {
  fontSize: 18,
  fontWeight: 'bold',
},
noItems: {
  fontWeight: 'bold',
  fontSize: 40,
  textAlign: 'center',
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
  borderRadius: 50, // Optional: rounded corners
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
    textAlign: 'center',
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
  borderRadius: 10,
},
modalView: {
  width: '75%', 
  height: '87%',
  padding: 20,
  backgroundColor: 'white',
  borderRadius: 10,  
},
headerModalContainer: {
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
},
modalNumber: {
  fontSize: 24,
  fontWeight: 'bold',
  top: 10,
  bottom: 10
},
modalName: {
  fontSize: 24,
  marginBottom: 15,
  top: 20,
  left: 10,
  textAlign: 'center',
},
descriptionBox: {
  width: '95%',
  height: '50%',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  padding: 10,
  marginTop: 30,
  textAlign: 'center'
},  
descriptionText: {
  fontSize: 16,
  textAlignVertical: 'top',
},
numbersContainer: {
  alignItems: 'center',
  marginTop: 20,
},
modalNumberText: {
  fontSize: 24,
  marginBottom: 10,
  textAlign: 'center'
},
ModalTextContainer: {
  flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
},
numberInput: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  padding: 5,
  marginLeft: 10,
  width: '50%', // Adjust width as needed
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
  textAlign: 'center'
},
removeButtonContainer: {
  //marginTop: 20,
  backgroundColor: '#f9f9f9',
  padding: 10,
  borderRadius: 5,
  justifyContent: 'center',
  alignItems: 'center',
},
removeButtonText: {
  marginTop: 5,  // Optional spacing
  color: 'black',  // Change color as needed
},
});