import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import {styles} from './styles';
import {images} from '../../assets/image';
import UserScreen from '../userScreen/UserScreen';
import SettingScreen from '../settingScreen/SettingScreen';

const MainScreen = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <View style={styles.container}>
      {selectedTab == 0 ? <UserScreen /> : <SettingScreen />}
      <View style={styles.bottomTab}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setSelectedTab(0);
          }}>
          <Image
            source={images.groupUser}
            style={[
              styles.tabIcon,
              {tintColor: selectedTab == 0 ? '#000' : '#A09F9F'},
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setSelectedTab(1);
          }}>
          <Image
            source={images.setting}
            style={[
              styles.tabIcon,
              {tintColor: selectedTab == 1 ? '#000' : '#A09F9F'},
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MainScreen;
