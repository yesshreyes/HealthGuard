import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

const NormalProfileScreen = () => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [mail, setMail] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleSave = () => {
    // Handle save profile action
    console.log('Profile saved');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={number}
          onChangeText={setNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={mail}
          onChangeText={setMail}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />
        <TextInput
          style={styles.input}
          placeholder="Height (cm)"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />
        <TextInput
          style={styles.input}
          placeholder="Weight (kg)"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#2196F3',
    padding: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  blocksContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  block: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 5,
    marginBottom: 8,
  },
  blockText: {
    color: '#2196F3',
  },
  saveButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#2196F3',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NormalProfileScreen;
