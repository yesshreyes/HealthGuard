import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axiosService from '../helper/axios';

const MedicalScreen = () => {
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
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
        setPhoneNo(userData.phone_no || '');
        setEmail(userData.email || '');
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
      phone_no: phoneNo,
      email: email,
      // age: parseInt(age, 10),
      height: parseFloat(height),
      weight: parseFloat(weight),
      medical_record: {
        allergies: allergies,
        dietary_restrictions: dietaryRestrictions,
      },
    };

    try {
      const response = await axiosService.put(`users/me/`, profileData);
      console.log('Profile updated:', response.data);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const formatText = (text) => text.split(',').map((item, index) => (
    <View key={index} style={styles.block}>
      <Text style={styles.blockText}>{item.trim()}</Text>
    </View>
  ));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputContainer}>
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
        <Text style={styles.saveButtonText}>Update Medical profile</Text>
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

export default MedicalScreen;
