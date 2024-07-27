// ExampleUsageScreen.js
import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import DialogScreen from './dialogbox'; // Adjust the path as necessary

const ExampleUsageScreen = () => {
  const [isDialogVisible, setDialogVisible] = useState(false);

  const openDialog = () => {
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
  };

  return (
    <View style={styles.container}>
      <Button title="Open Dialog" onPress={openDialog} />
      <DialogScreen visible={isDialogVisible} onClose={closeDialog} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2196F3',
  },
});

export default ExampleUsageScreen;
