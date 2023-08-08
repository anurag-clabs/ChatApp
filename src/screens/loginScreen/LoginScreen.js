import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {s, vs} from 'react-native-size-matters';
import {styles} from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import Loader from '../../components/Loader';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);

  const loginUser = () => {
    setVisible(true);
    firestore()
      .collection('users')
      .where('email', '==', email)
      .get()
      .then(res => {
        setVisible(false);
        if (res.docs !== []) {
          console.log(JSON.stringify(res.docs[0].data()));
          goToNext(
            res.docs[0].data().name,
            res.docs[0].data().email,
            res.docs[0].data().useId,
          );
        } else {
          Alert.alert('User not found');
        }
      })
      .catch(error => {
        setVisible(false);
        console.log(error);
        Alert.alert('User not found');
      });
  };
  const goToNext = async (name, email, useId) => {
    await AsyncStorage.setItem('NAME', name);
    await AsyncStorage.setItem('EMAIL', email);
    await AsyncStorage.setItem('USEID', useId);
    navigation.navigate('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginTop: vs(10)}}>
        <Text style={styles.menuTitle}>Login</Text>
      </View>
      <ScrollView style={{marginTop: vs(15)}}>
        <View style={{marginHorizontal: s(15)}}>
          <View>
            <Text style={styles.contact}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              placeholder="Enter Your Email"
              placeholderTextColor="#A7BABA"
            />
          </View>
          <View>
            <Text style={styles.contact}>Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              keyboardType="visible-password"
              placeholder="Enter Your Password"
              placeholderTextColor="#A7BABA"
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              style={styles.buttonView}
              onPress={() => {
                loginUser();
              }}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.login}>Or Sign Up</Text>
            </TouchableOpacity>
            <Loader visible={visible} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
