import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ItemDetailScreen = ({ route, navigation }) => {
  const { item } = route.params;  // Getting the selected item from params

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Item Details</Text>
      <Text style={styles.itemText}>Name: {item.name}</Text>
      <Text style={styles.itemText}>ID: {item.id}</Text>
      
      {/* Add any other details you'd like to display here */}

      <Button title="Close" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  itemText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ItemDetailScreen;