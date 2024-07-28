import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, Modal, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axiosService from '../helper/axios';

const ScanScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false); // To track if the barcode has been scanned
  const [modalVisible, setModalVisible] = useState(false); // To control modal visibility
  const [productName, setProductName] = useState(''); // To store product name

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (!scanned) {
      setScanned(true); // Prevent multiple scans

      // Make API request to Django backend
      try {
        const response = await axiosService.post('predict/', { barcode: data });
        console.log(response.data);
        setProductName(response.data.product_name); // Assuming the response contains product_name
        setModalVisible(true); // Show modal with product information
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('API Error', 'Failed to send data to backend');
        setScanned(false); // Allow scanning again in case of error
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleCloseModal = () => {
    setModalVisible(false);
    setScanned(false); // Allow scanning again after closing modal
  };

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

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.dialogContainer}>
            <Text style={styles.productName}>{productName}</Text>
            <TouchableOpacity style={styles.okButton} onPress={handleCloseModal}>
              <Text style={styles.buttonText}>Okay!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialogContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  okButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ScanScreen;
