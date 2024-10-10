//react imports
import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useContext} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { FlatList, Text, View, StyleSheet, TextInput, Button, TouchableOpacity, Modal, Pressable } from 'react-native';
import Header from '../components/Header'

import database from '@react-native-firebase/database';
import firebase from '@react-native-firebase/app';


export default function Food (){

    const [items, setItems] = useState({
        activities: [],
        blank: [],
        food: [],
      });

    const [screen, setScreen] = useState('exercise');
    const [itemName, setItemName] = useState('');

    const completedCount = items.activities.filter(item => item.completed).length;
    const totalCount = items.activities.length;

    //add an item to the database
    const handleAddItem = async(screen, itemName) => {
        if (itemName) {
            try {
                const ref = database().ref(`/data/${screen}`); //access the screenName

                await ref.push({
                    name: itemName,
                    
                })
            
                console.log('Data added successfully');
            }
            catch (error) {
                console.error('Error adding item', error);
            }
        }
    }
    return (
        <View style={styles.container}>
            <Header onAddItem={handleAddItem} />
            <View style={styles.counterContainer}>
                <Text style={styles.MealsText}>Completed Meals: </Text>
            </View>
            <View style={styles.flatListContainer}>

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

    }
})