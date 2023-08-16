import React, {useEffect} from 'react';
import StackNavigation from './src/navigation/StackNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['Require cycle:']);

const App = () => {
  return (
    <>
      <StackNavigation />
    </>
  );
};

export default App;
