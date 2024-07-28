import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import axiosService from '../helper/axios';

const DashboardScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await axiosService.get('users/');
      const userDataArray = response.data;
      console.log(userDataArray);

      if (userDataArray.length > 0) {
        setUserData(userDataArray[0]);
      } else {
        Alert.alert('Error', 'No user data found.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to fetch user data.');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserData().then(() => setRefreshing(false));
  }, []);

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const heightInMeters = userData.height ? userData.height / 100 : 0; // Assuming height is in cm
  const weightInKg = userData.weight || 0; // Weight in kg

  // Calculate BMI
  const bmi = heightInMeters ? weightInKg / (heightInMeters * heightInMeters) : 0;
  const bmiRounded = bmi.toFixed(1);

  // Determine BMI category
  let bmiCategory = '';
  if (bmi < 18.5) bmiCategory = 'Underweight';
  else if (bmi < 24.9) bmiCategory = 'Normal weight';
  else if (bmi < 29.9) bmiCategory = 'Overweight';
  else bmiCategory = 'Obesity';

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome {userData.first_name}!</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.cameraButton} onPress={() => navigation.navigate('Scan')}>
        <Ionicons name="camera" size={64} color="#2196F3" />
      </TouchableOpacity>

      <View style={styles.bmiCard}>
        <Text style={styles.bmiTitle}>Your BMI</Text>
        <Text style={styles.bmiValue}>{bmiRounded}</Text>
        <Text style={styles.bmiCategory}>{bmiCategory}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.profileContent}>
            <FontAwesome name="user" size={32} color="#2196F3" />
            <Text style={styles.profileText}>Profile</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.medicalReportButton} onPress={() => navigation.navigate('Medical')}>
          <Text style={styles.medicalReportButtonText}>Medical Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#2196F3',
    paddingTop: 32,
    paddingRight: 16,
    paddingLeft: 16,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2196F3',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#2196F3',
    fontSize: 16,
  },
  cameraButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  bmiCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bmiTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  bmiValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  bmiCategory: {
    fontSize: 18,
    color: '#555',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  profileButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileText: {
    fontSize: 18,
    color: '#2196F3',
    marginLeft: 8,
  },
  medicalReportButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  medicalReportButtonText: {
    color: '#2196F3',
    fontSize: 18,
  },
});

export default DashboardScreen;
