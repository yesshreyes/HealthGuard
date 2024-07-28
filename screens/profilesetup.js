import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axiosService from '../helper/axios';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [allergies, setAllergies] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosService.get('users/');
        const userDataArray = response.data;

        // Assuming we are fetching data for the first user in the array
        if (userDataArray.length > 0) {
          const userData = userDataArray[0];

          setName(`${userData.first_name} ${userData.last_name}`);
          setNumber(userData.phone_no || '');
          setAge(userData.age?.toString() || '');
          setHeight(userData.height?.toString() || '');
          setWeight(userData.weight?.toString() || '');

          // Check if medical_record exists before accessing its properties
          const medicalRecord = userData.medical_record || {};
          setAllergies(medicalRecord.allergies || '');
          setDietaryRestrictions(medicalRecord.dietary_restrictions || '');
        } else {
          Alert.alert('Error', 'No user data found.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data.');
      }
    };

    fetchUserData();
  }, []);

  const formatText = (text) => text.split(',').map((item, index) => (
    <View key={index} style={styles.block}>
      <Text style={styles.blockText}>{item.trim()}</Text>
    </View>
  ));

  const handleSave = async () => {
    const profileData = {
      name: name,
      phone_no: number,
      age: age,
      height: height,
      weight: weight,
      allergies: allergies,
      dietary_restrictions: dietaryRestrictions,
    };

    console.log('Data being sent:', profileData);

    try {
      const response = await axiosService.post('users/', profileData);
      console.log('Profile saved:', response.data);
      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error) {
      if (error.response) {
        Alert.alert('Save Failed', error.response.data.message);
      } else if (error.request) {
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    }
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
        <TextInput
          style={styles.input}
          placeholder="Allergies (comma separated)"
          value={allergies}
          onChangeText={setAllergies}
        />
        <TextInput
          style={styles.input}
          placeholder="Dietary Restrictions (comma separated)"
          value={dietaryRestrictions}
          onChangeText={setDietaryRestrictions}
        />
      </View>

      <View style={styles.blocksContainer}>
        <Text style={styles.sectionTitle}>Allergies</Text>
        {formatText(allergies)}

        <Text style={styles.sectionTitle}>Dietary Restrictions</Text>
        {formatText(dietaryRestrictions)}
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

export default ProfileScreen;
