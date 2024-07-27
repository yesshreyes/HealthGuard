// ProfileScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

const MedicalScreen = () => {
  const [healthProblems, setHealthProblems] = useState('');
  const [allergies, setAllergies] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');

  const formatText = (text) => text.split(',').map((item, index) => (
    <View key={index} style={styles.block}>
      <Text style={styles.blockText}>{item.trim()}</Text>
    </View>
  ));

  const handleSave = () => {
    // Handle save profile action
    console.log('Profile saved');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Health Problems (comma separated)"
          value={healthProblems}
          onChangeText={setHealthProblems}
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
        <Text style={styles.sectionTitle}>Health Problems</Text>
        {formatText(healthProblems)}

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

export default MedicalScreen;
