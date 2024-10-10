//react imports
import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useContext} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { FlatList, Text, View, StyleSheet, TextInput, Button, TouchableOpacity, Modal, Pressable } from 'react-native';
import Header from '../components/Header'

import database from '@react-native-firebase/database';
import firebase from '@react-native-firebase/app';

import { useItems, handleAddItem, handleRemoveItem, handleToggleCompletion, handleLongPress } from '../components/functions';

export default function Food (){

    const [items, setItems] = useItems();

    const [screen, setScreen] = useState('foods');
    const [itemName, setItemName] = useState('');

    const completedCount = items.foods.filter(item => item.completed).length;
    const totalCount = items.foods.length;

    //add an item to the database
    const addItem = (screen, itemName) => {
        handleAddItem(screen, itemName, setItems); // Pass setItems to handleAddItem    
    };

    const removeItem = (itemName) => {
        handleRemoveItem(screen, itemName, setItems);
    }

    const toggleCompletion = (ItemID) => {
        handleToggleCompletion(ItemID, screen, setItems);
    }

    const longPress = (item, index) => {
        handleLongPress(item, index);
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
                        onLongPress={() => longPress(item, index)}  // Handle long press
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


})
