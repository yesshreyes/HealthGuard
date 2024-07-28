// DialogScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const DialogScreen = ({ visible, onClose }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.dialogContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/300' }} // Replace with your image URL
            style={styles.image}
          />
          <View style={styles.infoCard}>
            <View style={styles.checkmarkContainer}>
              <View style={styles.checkmark}>
                <FontAwesome name="check" size={32} color="#fff" />
              </View>
              <Text style={styles.infoText}>Allergy: David</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.okButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Okay!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialogContainer: {
    width: '90%',
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
  image: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkmarkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkmark: {
    backgroundColor: 'green',
    borderRadius: 50,
    padding: 16,
    marginRight: 16,
  },
  infoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 5,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  okButton: {
    backgroundColor: '#2196F3',
  },
  alternativesButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  alternativesButtonText: {
    color: '#2196F3',
  },
});

export default DialogScreen;
