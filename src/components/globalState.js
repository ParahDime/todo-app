import React, { createContext, useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';

// Create the context
export const GlobalContext = createContext();

// Create a provider component
export const GlobalProvider = ({ children }) => {
    const [exercises, setExercises] = useState([]);
    const [foods, setFoods] = useState([]);

    // Function to retrieve both collections (exercises and foods) once
    const retrieveDataOnce = async () => {
        try {
            const exerciseSnapshot = await firestore().collection('exercises').get(); //snapshot of exercise collection
            const foodSnapshot = await firestore().collection('foods').get();

            const exerciseData = exerciseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); //each item in exercise data
            const foodData = foodSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setExercises(exerciseData); // Store exercise data in state
            setFoods(foodData);         // Store food data in state
        } catch (error) {
            console.error('Error retrieving data:', error);
        }
    };

    // Retrieve data once on app initialization
    useEffect(() => {
        retrieveDataOnce();
    }, []);

    // Function to update a single exercise in Firestore
    const updateExercise = async (exerciseId, updatedData) => {
        try {
            await firestore().collection('exercises').doc(exerciseId).update(updatedData);
            setExercises(prevExercises => 
                prevExercises.map(item => item.id === exerciseId ? { ...item, ...updatedData } : item)
            );
        } catch (error) {
            console.error('Error updating exercise:', error);
        }
    };

    // Function to update a single food item in Firestore
    const updateFood = async (foodId, updatedData) => {
        try {
            await firestore().collection('foods').doc(foodId).update(updatedData);
            setFoods(prevFoods => 
                prevFoods.map(item => item.id === foodId ? { ...item, ...updatedData } : item)
            );
        } catch (error) {
            console.error('Error updating food:', error);
        }
    };

    return (
        <GlobalContext.Provider value={{ exercises, foods, updateExercise, updateFood }}>
            {children}
        </GlobalContext.Provider>
    );
};
