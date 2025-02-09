import { Stack } from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function RootLayout() {

  return (
    <Stack>
      <Stack.Screen name="Search" options={{
        title: 'Search',
        headerShown: false,
        headerLeft: () => (
          <MaterialIcons name="catching-pokemon" size={30} color={'red'} style={{marginRight: 3}}/>
        ),
      }} />
      <Stack.Screen name="pokemon" options={{
        // headerShown: false 
        title: '',
        headerTransparent: true,
        headerTintColor: "white",
        headerStyle: {backgroundColor: 'black',},
      }}/>
    </Stack>
  );
}
