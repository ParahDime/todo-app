import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const Header = ({ onAddItem }) => {
    const [itemName, setItemName] = useState('');
    const [selectedScreen, setSelectedScreen] = useState('activities');

    const handleAddItem = () => {
        if (itemName) {
            onAddItem(selectedScreen, itemName);
            setItemName(''); // Clear input
        }
    };

    return (
        <View style={styles.header}>
            <TextInput
                style={styles.input}
                value={itemName}
                onChangeText={setItemName}
                placeholder="Add an item"
            />
            <Picker
                selectedValue={selectedScreen}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedScreen(itemValue)}
            >
                <Picker.Item label="Activities" value="activities" />
                <Picker.Item label="Blank" value="blank" />
                <Picker.Item label="Food Items" value="food" />
            </Picker>
            <Button title="Add" onPress={handleAddItem} />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0,
        marginTop: '10%',
        borderWidth: 2, // Border width
        borderColor: '#000', // Border color (black)
        padding: 10, // Optional: add some padding
        borderRadius: 5, // Optional: add rounded corners
        borderBlockColor: 'blue',
        backgroundColor: 'lightgray',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        flex: 1,
        marginRight: 10,
        //flex: 0.55
        
    },
    picker: {
        height: 50,
        width: 150,
        marginRight: 10,
        flex: 0.2
    },
    button: {
        //flex: 0.2
    }
});

export default Header;