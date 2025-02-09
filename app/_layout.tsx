import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";

import React from 'react'
import SplashScreen from "../SplashScreen";

function _layout() {

  const [fontLoaded] = useFonts({
    'poppins': require('../assets/fonts/Poppins-Regular.ttf'),
    'agbaluma': require('../assets/fonts/Agbalumo-Regular.ttf'),
  });

  if(!fontLoaded){
    return <SplashScreen/>
  }

  return (
    <Tabs>
        <Tabs.Screen name="(tabs)" options={{
            headerShown: false,
            title: 'Pokemons',
            tabBarIcon: ()=>   <MaterialIcons name="catching-pokemon" size={30} color={'red'} style={{marginRight: 3}}/>
         
        }} />

        <Tabs.Screen name="(ability)"  options={{
            headerShown: false,
            title: 'Abilities',
            tabBarIcon: ()=> <FontAwesome name="leaf" size={24} color="green" />
        }} />

        <Tabs.Screen name="(search)"  options={{
            headerShown: false,
            title: 'Search',
            headerTransparent: true,
            headerTintColor: "white",
            headerStyle: {backgroundColor: 'black',},
            tabBarIcon: ()=> <FontAwesome name="search" size={24} color="black" />
        }} />
    </Tabs>
  )
}

export default _layout