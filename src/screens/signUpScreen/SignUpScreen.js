import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {styles} from './styles';
import {s, vs} from 'react-native-size-matters';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

const SignUpScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const registerUser = () => {
    const useId = uuid.v4();
    firestore()
      .collection('users')
      .doc(useId)
      .set({
        name: name,
        email: email,
        password: password,
        mobile: mobile,
        useId: useId,
      })
      .then(res => {
        console.log('user created');
        navigation.navigate('Login');
      })
      .catch(error => {
        console.log(error);
      });
  };
  const validate = () => {
    let isValid = true;
    if (name == '') {
      isValid = false;
    }
    if (email == '') {
      isValid = false;
    }
    if (mobile == '') {
      isValid = false;
    }
    if (password == '') {
      isValid = false;
    }
    if (confirmPassword == '') {
      isValid = false;
    }
    if (confirmPassword !== password) {
      isValid = false;
    }
    return isValid;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginTop: vs(10)}}>
        <Text style={styles.menuTitle}>SignUp</Text>
      </View>
      <ScrollView style={{marginTop: vs(15)}}>
        <View style={{marginHorizontal: s(15)}}>
          <View>
            <Text style={styles.contact}>Full Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => setName(text)}
              value={name}
              keyboardType="name-phone-pad"
              placeholder="Enter Your Name"
              placeholderTextColor="#A7BABA"
            />
          </View>
          <View>
            <Text style={styles.contact}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => setEmail(text)}
              value={email}
              keyboardType="email-address"
              placeholder="Enter Your Email"
              placeholderTextColor="#A7BABA"
            />
          </View>
          <View>
            <Text style={styles.contact}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => setMobile(text)}
              value={mobile}
              maxLength={10}
              keyboardType="number-pad"
              placeholder="Enter Your Mobile Number"
              placeholderTextColor="#A7BABA"
            />
          </View>
          <View>
            <Text style={styles.contact}>Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => setPassword(text)}
              value={password}
              keyboardType="visible-password"
              placeholder="Enter Your Password"
              placeholderTextColor="#A7BABA"
            />
          </View>
          <View>
            <Text style={styles.contact}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => setConfirmPassword(text)}
              value={confirmPassword}
              keyboardType="visible-password"
              placeholder="Enter Your ConfirmPassword"
              placeholderTextColor="#A7BABA"
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity style={styles.buttonView}>
              <Text
                style={styles.buttonText}
                onPress={() => {
                  if (validate()) {
                    registerUser();
                  } else {
                    Alert.alert('Please Enter Correct Data');
                  }
                }}>
                Sign Up
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Text style={styles.login}>Or Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
