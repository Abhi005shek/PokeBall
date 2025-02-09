import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated, Easing } from 'react-native';

function _SplashScreen() {
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true, // Use native driver for better performance
      })
    ).start();
  }, [rotateValue]);

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
      <Image 
        style={{borderWidth: 0, height: '8%', width: '50%'}} 
        source={require('./assets/images/pokeLogo.png')}
        // source={{uri: "https://static.vecteezy.com/system/resources/previews/027/127/591/original/pokemon-logo-pokemon-icon-transparent-free-png.png"}}
      />
      
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Animated.View style={animatedStyle}>
          <MaterialIcons name="catching-pokemon" size={50} color={'red'} style={{marginRight: 3}}/>
        </Animated.View>
        {/* <Text>Loading...</Text> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
  },
});

export default _SplashScreen;
