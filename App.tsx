import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ApolloProvider } from "@apollo/client/react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import client from "./src/graphql/apollo";
import CharacterListScreen from "./src/screens/CharacterListScreen";
import EpisodeListScreen from "./src/screens/EpisodeListScreen";
import CharacterDetailScreen from "./src/screens/CharaterDetailScreen";

export type CharacterStackParamList = {
  CharacterList: undefined;
  CharacterDetail: { id: string };
};

export type EpisodeStackParamList = {
  EpisodeList: undefined;
};

export type TabParamList = {
  CharacterStack: undefined;
  EpisodeStack: undefined;
};

const CharacterStack = createNativeStackNavigator<CharacterStackParamList>();
const EpisodeStack = createNativeStackNavigator<EpisodeStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function CharacterStackNavigator() {
  return (
    <CharacterStack.Navigator>
      <CharacterStack.Screen
        name="CharacterList"
        component={CharacterListScreen}
        options={{ title: "Characters" }}
      />

      <CharacterStack.Screen
        name="CharacterDetail"
        component={CharacterDetailScreen}
        options={{ title: "Character Detail" }}
      />
    </CharacterStack.Navigator>
  );
}

function EpisodeStackNavigator() {
  return (
    <EpisodeStack.Navigator>
      <EpisodeStack.Screen
        name="EpisodeList"
        component={EpisodeListScreen}
        options={{ title: "Episodes" }}
      />
    </EpisodeStack.Navigator>
  );
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap;

              if (route.name === "CharacterStack") {
                iconName = focused ? "people" : "people-outline";
              } else if (route.name === "EpisodeStack") {
                iconName = focused ? "film" : "film-outline";
              } else {
                iconName = "help-circle";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#008309ff",
            tabBarInactiveTintColor: "gray",
            headerShown: false,
          })}
        >
          <Tab.Screen
            name="CharacterStack"
            component={CharacterStackNavigator}
            options={{ title: "Characters" }}
          />

          <Tab.Screen
            name="EpisodeStack"
            component={EpisodeStackNavigator}
            options={{ title: "Episodes" }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
