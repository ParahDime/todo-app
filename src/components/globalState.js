import React, { createContext, useState } from 'react';

// Create a Context
export const GlobalContext = createContext();

// Create a Provider component
export const GlobalProvider = ({ children }) => {
    const [items, setItems] = useState([]);

    const addItem = (item) => {
        setItems((prevItems) => [...prevItems, item]);
    };

    const removeItem = (id) => {
        setItems((prevItems) => prevItems.filter(item => item.id !== id));
    };

    return (
        <GlobalContext.Provider value={{ items, addItem, removeItem }}>
            {children}
        </GlobalContext.Provider>
    );
};