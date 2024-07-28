import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axiosService from '../helper/axios';

const NormalProfileScreen = () => {
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [number, setNumber] = useState('');
  const [mail, setMail] = useState('');
  // const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [allergies, setAllergies] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosService.get('users/me/');
        const userData = response.data;
        console.log(userData);
        setUserId(userData.id);
        setFirstName(userData.first_name);
        setLastName(userData.last_name);
        setNumber(userData.phone_no || '');
        setMail(userData.email || '');
        // setAge(userData.age?.toString() || '');
        setHeight(userData.height?.toString() || '');
        setWeight(userData.weight?.toString() || '');
        setAllergies(userData.medical_record?.allergies || '');
        setDietaryRestrictions(userData.medical_record?.dietary_restrictions || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data.');
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    const profileData = {
      first_name: firstName,
      last_name: lastName,
      phone_no: number,
      email:mail,
      // age: parseInt(age, 10),
      height: parseFloat(height),
      weight: parseFloat(weight),
      medical_record: {
        allergies: allergies,
        dietary_restrictions: dietaryRestrictions,
      },
    };

    try {
      const response = await axiosService.put(`users/me/`, profileData); // Assuming 'PUT' is the method to update the profile
      console.log('Profile updated:', response.data);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error.response.data);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputContainer}>
      <TextInput
          style={styles.input}
          placeholder="Email"
          value={mail}
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={number}
          onChangeText={setNumber}
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
        {/* <TextInput
          style={styles.input}
          placeholder="Allergies"
          value={allergies}
          onChangeText={setAllergies}
        />
        <TextInput
          style={styles.input}
          placeholder="Dietary Restrictions"
          value={dietaryRestrictions}
          onChangeText={setDietaryRestrictions}
        /> */}
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
