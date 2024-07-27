import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';

const ScanScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false); // To track if the barcode has been scanned

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (!scanned) {
      setScanned(true); // Prevent multiple scans
      Alert.alert(`Barcode scanned!`, `Type: ${type}\nData: ${data}`);

      // Make API request to Django backend
      try {
        const response = await fetch('https://your-django-backend-url/api/endpoint/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ barcode: data }),
        });

        const result = await response.json();
        console.log(result);
        Alert.alert('API Response', JSON.stringify(result));
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('API Error', 'Failed to send data to backend');
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Scan for Details</Text>

        <View style={styles.scanner}>
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={styles.camera}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004000', // darker green
    padding: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  scanner: {
    width: '100%',
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden', // Ensure camera doesn't overflow container
  },
  camera: {
    width: '100%',
    height: '100%',
  },
});

export default ScanScreen;
