import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';

import { FlatList, Text, View, StyleSheet, Button } from 'react-native';

import Tabs from './src/components/tabs'
import Exercise from './src/screens/exercise'
import Header from './src/components/Header'

export default function App() {
  return (
    <Exercise />
  );
}

