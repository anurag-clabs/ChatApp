import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/loginScreen/LoginScreen';
import SignUpScreen from '../screens/signUpScreen/SignUpScreen';
import MainScreen from '../screens/mainScreen/MainScreen';
import SplashScreen from '../screens/spleshScreen/SplashScreen';
import ChatScreen from '../screens/ChatScreen/ChatScreen';
import MessageScreen from '../screens/messageScreen/MessageScreen';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Message" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
