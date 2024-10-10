import React, { useState } from "react";

export function useItems() {
    const [items, setItems] = useState({
      activities: [],
      planner: [],
      foods: [],
    });
  
    return [items, setItems]; // Return both state and setter
}

//handles adding items to the array
export function handleAddItem(screen, itemName, setItems) {

    if (itemName) { //if it has a name
        setItems(prevItems => {

          // Select the appropriate array based on the screen
          let updatedArray = { ...prevItems };
          
          if (screen === 'foods') {
            // Add the new item to the food array
            updatedArray = [...prevItems[screen], { name: itemName, id: Date.now(), completed: false }]; //add items to the array
            return {
              ...prevItems,
              foods: updatedArray, // Update the food array
            };


          } else if (screen === 'activities') {
            // Add the new item to the activities array
            updatedArray = [...prevItems[screen], { name: itemName }];
            return {
              ...prevItems,
              activities: updatedArray, // Update the activities array
            };
          } else if (screen === 'planner') {
            // Add the new item to the blank array (if you need this)
            updatedArray = [...prevItems[screen], { name: itemName }];
            return {
              ...prevItems,
              planner: updatedArray, // Update the blank array
            };
          }
        });
    
        // Optionally log the result or show a message to the user
        console.log(`Item "${itemName}" added to ${screen}`);
      }
      else {
          console.log('Error item not added to screen');
      }
}

handleRemoveItem = (screen, ItemID, setItems) => {
    setItems((prevItems) => ({
      ...prevItems,
      [screen]: prevItems[screen].filter(item => item.id !== itemId)  // Remove item by id
    }));

    setItemNo1('');  //reset itemNo to empty or 0
    setItemNo2('');

    //REMOVE ITEMS

    setModalVisible(false);  //close the modal after removing
  };


//helper function to toggle item as completed
export function handleToggleCompletion (itemId, screen, setItems)  {
    setItems((prevItems) => {
      const updatedItems = prevItems[screen].map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );

      return {
        ...prevItems,
        [screen]: reorderItems(updatedItems),  //reorder list after update
      };
    });
  };

  const reorderItems = (updatedItems) => {
    
    return updatedItems
    // Move completed items to the bottom while keeping their original order
    console.log("ffff")
      .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
  }

export function handleLongPress (item, index) {
    //setSelectedItem(item);  // Set the selected item details
    //setSelectedIndex(index + 1);  // Get the item number
    //setPersistentDescription(item.description);  // Set Item description
    //setItemNo1Value(itemNo1Value.toString()); // Set the value for numbers
    //setItemNo2Value(itemNo2Value.toString());
    //setEditableName(item.name); //Set the name (editable)
    //setModalVisible(true);  // Show the modal popup
}
  