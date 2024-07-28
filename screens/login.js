import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { saveUserData } from '../storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://172.26.224.226:8000/api/v1/login/', {
        email,
        password,
      });
      
      const { data } = response;
      await saveUserData(data);
      navigation.navigate('Dashboard');
    } catch (error) {
      if (error.response) {
        Alert.alert('Login Failed', error.response.data.message);
      } else if (error.request) {
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello{'\n'}Welcome Back!</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Mail"
        placeholderTextColor="#000"
        value={email}
        onChangeText={setEmail}
      />
      
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#000"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.togglePasswordContainer}>
          <Text style={styles.togglePassword}>{passwordVisible ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
      
      <Button
        title="Log In"
        onPress={handleLogin}
        color="#000"
      />
      
      <View style={styles.newUserContainer}>
        <Text style={styles.newUserText}>New user?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#2196F3',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
  
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
    width: '100%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  passwordInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
  },
  togglePasswordContainer: {
    padding: 10,
  },
  togglePassword: {
    color: 'yellow',
  },
  forgotPassword: {
    color: 'lightgray',
    alignSelf: 'flex-end',
    paddingBottom: 20,
  },
  newUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  newUserText: {
    color: '#fff',
    marginRight: 4,
  },
  signUpText: {
    color: 'yellow',
  },
});

export default LoginScreen;
