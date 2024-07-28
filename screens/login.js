// LoginScreen.js
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
      
      // Assuming the response contains user data and a token
      const { data } = response;
      await saveUserData(data);
      // Navigate to the dashboard
      navigation.navigate('Dashboard');
      
      // Optionally, save user data and token in local storage or context
      // e.g., AsyncStorage.setItem('userToken', data.token);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        Alert.alert('Login Failed', error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
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
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#000"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Text style={styles.togglePassword}>{passwordVisible ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
      
      <Button
        title="Log In"
        onPress={handleLogin}
        color="#fff"
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
    marginBottom: 24,
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
  togglePassword: {
    marginLeft: 10,
    color: 'yellow',
  },
  forgotPassword: {
    color: 'lightgray',
    alignSelf: 'flex-end',
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
