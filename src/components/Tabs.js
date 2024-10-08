import * as React from "react";

import { NavigationContainer } from "@react-navigation/native"; //test
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; //test

import { StyleSheet } from "react-native";
import { Feather, FontAwesome5, SimpleLineIcons } from "@expo/vector-icons";

import { getHeaderTitle } from "@react-navigation/elements"; //test

import Exercise from "../screens/exercise";
import Food from "../screens/food"
//import Food from "../screens/food"

const Tab = createBottomTabNavigator();

export default function Tabs() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
            <Tab.Screen 
                style={styles.tabBar}
                name={"Exercise"}
                component={Exercise}
                color={"green"}
                options={{
                    headerShown: false,
                    tabBarLabel: "Exercise list",
                    tabBarIcon: ({ focused }) => (
                      <Feather
                        name={"activity"}
                        size={25}
                        color={focused ? "tomato" : "black"}
                      />
                    ),
                  }}
            />

<Tab.Screen 
                style={styles.tabBar}
                name={"Meal Planner"}
                component={Food}
                color={"green"}
                options={{
                    headerShown: false,
                    tabBarLabel: "Meal Planning",
                    tabBarIcon: ({ focused }) => (
                      <Feather
                        name={"gift"}
                        size={25}
                        color={focused ? "tomato" : "black"}
                      />
                    ),
                  }}
            />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    tabBar: {
      textAlign: "center",
    },
  });