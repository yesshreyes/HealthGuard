// SignUpScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, LogBox } from 'react-native';
import { useNavigation } from '@react-navigation/native';

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [conPassword, setConPassword] = useState('');
  const [conPasswordVisible, setConPasswordVisible] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (registrationStatus) {
      navigation.navigate('Dashboard');
    }
  }, [registrationStatus, navigation]);

  const handleRegister = () => {
    console.log("Register button clicked with email:", email);
    // Mock registration process
    setTimeout(() => {
      setRegistrationStatus(true);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <Text style={styles.subtitle}>Let's Connect</Text>

      <TextInput
        style={styles.input}
        placeholder="GITAM mail"
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

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#000"
          secureTextEntry={!conPasswordVisible}
          value={conPassword}
          onChangeText={setConPassword}
        />
        <TouchableOpacity onPress={() => setConPasswordVisible(!conPasswordVisible)}>
          <Text style={styles.togglePassword}>{conPasswordVisible ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Register"
        onPress={handleRegister}
        color="#fff"
      />

      <View style={styles.newUserContainer}>
        <Text style={styles.newUserText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signUpText}>Log In</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
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

export default SignUpScreen;
