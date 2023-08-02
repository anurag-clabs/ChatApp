import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';
import {s, vs} from 'react-native-size-matters';
import {styles} from './styles';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginTop: vs(10)}}>
        <Text style={styles.menuTitle}>SignUp</Text>
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
            <TouchableOpacity style={styles.buttonView}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.login}>Or Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
