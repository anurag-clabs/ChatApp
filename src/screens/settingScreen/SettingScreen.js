import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {styles} from './styles';

const SettingScreen = () => {
  const [mode, setMode] = useState('LIGHT');
  const isFocued = useIsFocused();
  const changeMode = async x => {
    await AsyncStorage.setItem('MODE', x);
  };
  useEffect(() => {
    getMode();
  }, [isFocued]);
  const getMode = async () => {
    setMode(await AsyncStorage.getItem('MODE'));
  };
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: mode == 'LIGHT' ? 'white' : '#212121'},
      ]}>
      <View style={styles.themChangeView}>
        <Text style={{color: mode == 'LIGHT' ? 'black' : 'white'}}>
          Change Mode
        </Text>
        <TouchableOpacity
          style={[
            styles.btn,
            {backgroundColor: mode == 'LIGHT' ? 'black' : 'white'},
          ]}
          onPress={() => {
            setMode(mode == 'LIGHT' ? 'DARK' : 'LIGHT');
            changeMode(mode == 'LIGHT' ? 'DARK' : 'LIGHT');
          }}>
          <Text style={{color: mode == 'LIGHT' ? 'white' : 'black'}}>
            Dark Mode
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingScreen;
