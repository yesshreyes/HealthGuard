// ForgotPasswordScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [conPassword, setConPassword] = useState('');
  const [conPasswordVisible, setConPasswordVisible] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops, forgot your password?</Text>

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

      <Button
        title="Submit"
        onPress={() => { /* Handle submit action */ }}
        color="#fff"
      />
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
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
    width: '100%',
  },
  togglePassword: {
    marginLeft: 10,
    color: 'yellow',
  },
});

export default ForgotPasswordScreen;
