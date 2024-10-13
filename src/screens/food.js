//react imports
import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useContext} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { FlatList, Text, View, StyleSheet, TextInput, Button, TouchableOpacity, Modal, Pressable } from 'react-native';

import Header from '../components/Header'
import { Feather } from '@expo/vector-icons'

import database from '@react-native-firebase/database';
import firebase from '@react-native-firebase/app';

import { useItems, handleAddItem, handleRemoveItem, handleToggleCompletion, closeFoodModal, longPressFood } from '../components/functions';

const Stack = createStackNavigator();

export default function Food (){

    const [items, setItems] = useItems();

    const [screen, setScreen] = useState('foods');
    const [itemName, setItemName] = useState('');

    //Variables for modal
    const [selectedItem, setSelectedItem] = useState(null); //item used in modal
    const [modalVisible, setModalVisible] = useState(false); 
    const [selectedIndex, setSelectedIndex] = useState(null);//Number in list
    const [editableName, setEditableName] = useState(' ');//Name (editable)
    const [sdescription, setDescription] = useState(' ');//Description
    const [ingredients, setIngredients] = useState(' ');//ingredients

    const completedCount = items.foods.filter(item => item.completed).length;
    const totalCount = items.foods.length;

    //add an item to the database
    const addItem = (screen, itemName) => {
        handleAddItem(screen, itemName, setItems); // Pass setItems to handleAddItem    
    };

    const removeItem = (itemID) => {
        handleRemoveItem(screen, itemID, setItems, setModalVisible);
    }

    const toggleCompletion = (ItemID) => {
        handleToggleCompletion(ItemID, screen, setItems)
    }

    const longPressed = (item, index) => {
        longPressFood(item, index, setSelectedItem, setSelectedIndex, setEditableName, setDescription, setModalVisible, setIngredients);
    }

    const closeModal = () => {
        closeFoodModal(selectedItem, setModalVisible, sdescription, editableName, setItems, screen);
    }

    return (
        <View style={styles.container}>
            <Header onAddItem={addItem} />
            <View style={styles.counterContainer}>
            <Text style={completedCount === totalCount ? styles.completedMealsText : styles.MealsText}>
                Items completed: {completedCount}/{totalCount}
            </Text>
            </View>
            <View style={styles.flatListContainer}>
            <FlatList 
                data={items.foods}
                renderItem={({ item, index }) => (
                    <View
                        style={[
                        styles.itemContainer,
                        item.completed ? styles.completedItem : null, // Apply green background if completed
                        ]}
                    >
                    <TouchableOpacity
                        style={[styles.itemContainer, item.completed ? styles.completedItem : null]}
                        onPress={() => toggleCompletion(item.id)}
                        onLongPress={() => longPressed(item, index)}  // Handle long press
                    >

            
                    <Text style={styles.itemNumber}>{index + 1}</Text>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Button
                        title={item.completed ? '✔️' : '❌'}
                        onPress={() => toggleCompletion(item.id)}
                    />
                    </TouchableOpacity>
                </View>

        
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={items.foods.length === 0 ? styles.emptyList : {}}
                ListEmptyComponent={<Text style={styles.noItems}>No items to display</Text>}
            />

            </View>
                {/* Modal to display item details */}
            {selectedItem && (
                <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                    {/* Item Number and Name at the top */}
                    <View style={styles.headerModalContainer}>
                    <Text style={styles.modalNumber}>#{selectedIndex}</Text>
                    <TouchableOpacity 
                    onPress={() => removeItem(selectedItem.id)}  // Call remove function
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

                    {/* Ingredients Box */}
                    <View style={styles.ingredientsBox}>
                    <TextInput
                        //style={styles.descriptionText}
                        placeholder="List of ingredients"
                        multiline={true}
                        numberOfLines={3}
                        onChangeText={setIngredients}
                        value={ingredients}
                    />
                    </View> 

                    {/* Description Box */}
                    <View style={styles.descriptionBox}>
                    <TextInput
                        style={styles.descriptionText}
                        placeholder="Description of meal"
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={setDescription}
                        value={sdescription}
                    />
                    </View>          

                <Pressable style={styles.closeButton} onPress={closeModal}>
                    <Text style={styles.closeButtonText}>Save & Close</Text>
                </Pressable>
            </View>
            </View>
            </Modal>
            )}

            <StatusBar style="auto" />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#gray',
    alignItems: 'center',
    },
    MealsText: {
        fontSize: 16,
    },
    completedMealsText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    counterContainer: {

    },
    flatListContainer: {
        flex: 1,
        width: '99%',
        borderWidth: 2,
        borderColor: 'black',
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
      noItems: {
        fontWeight: 'bold',
        fontSize: 40,
        textAlign: 'center',
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
      ingredientsBox: {
        width: '95%',
        height: '20%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginTop: 30,
        textAlign: 'center'
      },  
      descriptionBox: {
        width: '95%',
        height: '40%',
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


})
