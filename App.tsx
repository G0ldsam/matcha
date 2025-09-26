// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Intro from './src/screens/Intro';
import Profile from './src/screens/Profile';
import ScanScreen from './src/screens/ScanScreen';

export type RootStackParamList = {
  Intro: undefined;
  Profile: { baziResult: any };
  Scan: { myDominant: string };
};


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Intro" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Intro" component={Intro} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Scan" component={ScanScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
