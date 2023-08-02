import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {styles} from './styles';
import {s, vs} from 'react-native-size-matters';

const SignUpScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
              onChangeText={setName}
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
              onChangeText={setEmail}
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
              onChangeText={setMobile}
              value={mobile}
              keyboardType="number-pad"
              placeholder="Enter Your Mobile Number"
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
          <View>
            <Text style={styles.contact}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              keyboardType="visible-password"
              placeholder="Enter Your ConfirmPassword"
              placeholderTextColor="#A7BABA"
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity style={styles.buttonView}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.login}>Or Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
