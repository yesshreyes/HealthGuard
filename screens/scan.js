import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axiosService from '../helper/axios';

const ScanScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [productName, setProductName] = useState('');
  const [consumable, setConsumable] = useState('');
  const [allergen, setAllergen] = useState('');
  const [dietaryRestriction, setDietaryRestriction] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (!scanned) {
      setScanned(true);
      setLoading(true);
      setError('');

      try {
        const response = await axiosService.post('predict/', { barcode: data });
        console.log(response.data);
        setProductName(response.data.product_name);
        setConsumable(response.data.consumable);
        setAllergen(response.data.allergen);
        setDietaryRestriction(response.data.dietary_restriction);
        setModalVisible(true);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to send data to backend');
        setScanned(false);
      } finally {
        setLoading(false);
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
    setScanned(false);
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

        {loading && (
          <ActivityIndicator size="large" color="#fff" style={styles.loading} />
        )}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
  <View style={[styles.dialogContainer, { backgroundColor: consumable === 'Yes' ? '#00FF00' : '#FF0000' }]}>
    <Text style={styles.productName}>{productName}</Text>
    <Text style={styles.consumableText}>Consumable: {consumable}</Text>
    {consumable === 'No' && (
      <>
        <Text style={styles.detailText}>Allergen: {allergen}</Text>
        <Text style={styles.detailText}>Dietary Restriction: {dietaryRestriction}</Text>
      </>
    )}
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
    backgroundColor: '#004000',
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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  loading: {
    marginTop: 20,
  },
  errorText: {
    color: '#ff0000',
    textAlign: 'center',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialogContainer: {
    width: '80%',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  consumableText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
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
