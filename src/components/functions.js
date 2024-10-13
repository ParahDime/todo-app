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
            updatedArray = [...prevItems[screen], { name: itemName, id: Date.now(), description: " ", ingredients: ' ' ,completed: false }]; //add items to the array
            return {
              ...prevItems,
              foods: updatedArray, // Update the food array
            };


          } else if (screen === 'activities') {
            // Add the new item to the activities array
            updatedArray = [...prevItems[screen], { name: itemName, id: Date.now(), description: " ", value1: 0, value2: 0, completed: false }];
            return {
              ...prevItems,
              activities: updatedArray, // Update the activities array
            };
          } else if (screen === 'planner') {
            // Add the new item to the blank array (if you need this)
            updatedArray[screen] = [...prevItems[screen], { name: itemName }];
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

export function handleRemoveItem (screen, ItemID, setItems, setModalVisible) {
    setItems((prevItems) => ({
      ...prevItems,
      [screen]: prevItems[screen].filter(item => item.id !== ItemID)  // Remove item by id
    }));

    setModalVisible(false);  //close the modal after removing
    return; 
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
      .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
  }

export function LongPressActivity (item, index, setSelectedItem, setSelectedIndex, setDescription, setItemNo1Value, setItemNo2Value, setEditableName, setModalVisible) {
    setSelectedItem(item);  // Set the selected item details
    setSelectedIndex(index + 1);  // Get the item number
    setDescription(item.description);  // Set Item description
    setItemNo1Value(item.value1.toString()); // Set the value for numbers
    setItemNo2Value(item.value2.toString());
    setEditableName(item.name); //Set the name (editable)
    setModalVisible(true);  // Show the modal popup
    return;
}

//handle items being called by the modal (Foods screen)
export function longPressFood (item, index, setSelectedItem, setSelectedIndex, setEditableName, setDescription, setModalVisible, setIngredients) {
  setSelectedItem(item);
  setSelectedIndex(index + 1);
  setEditableName(item.name);
  setDescription(item.description);
  setIngredients(item.ingredients)
  setModalVisible(true);
  return;
}

//edit function, check compatability (and item calls)
export function closeActivityModal(selectedItem, setModalVisible, sdescription, editableName, setItems, screen, newNum1, newNum2) {
// Find the item in your state and update it
if (selectedItem) {
  const validItemNo1 = newNum1.trim() === '' ? 0 : parseInt(newNum1);
  const validItemNo2 = newNum1.trim() === '' ? 0 : parseInt(newNum2);
  
  console.log(validItemNo1);

  //Update the details of the item
  setModalVisible(false); //close the modal
  setItems((prevItems) => {
  
    return {
      ...prevItems,
      activities: prevItems.activities.map((item) =>
        item.id === selectedItem.id 
      ? { ...item, description: sdescription, name: editableName, number1: parseInt(validItemNo1), number2: parseInt(validItemNo2) } 
      : item   
      ),
    };
  });
}  
}
  
//edit function, check compatability (and item calls)
export function closeFoodModal (selectedItem, setModalVisible, sdescription, editableName, setItems, screen ) {
  //console.log(selectedItem);
  if (selectedItem) {
    //Update the details of the item
    setModalVisible(false); //close the modal
    setItems((prevItems) => {
    
      return {
        ...prevItems,
        foods: prevItems.foods.map((item) =>
          item.id === selectedItem.id 
        ? { ...item, description: sdescription, name: editableName } 
        : item   
        ),
      };
    });
  }  
}

