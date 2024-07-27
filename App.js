import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/login';
import ForgotPasswordScreen from './screens/forgotpass'; // Create this component
import DashboardScreen from './screens/dashboard'; // Create this component
import SignUpScreen from './screens/signup'; // Create this component
import ScanScreen from './screens/scan';
import ExampleUsageScreen from './screens/example';
import ProfileScreen from './screens/profilesetup';
import NormalProfileScreen from './screens/profile';
import MedicalScreen from './screens/medical';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
        {/* <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        {/* <Stack.Screen name="SignUp" component={SignUpScreen} /> */}
        <Stack.Screen name="Scan" component={ScanScreen} />
        {/* <Stack.Screen name="Example" component={ExampleUsageScreen} /> */}
        {/* <Stack.Screen name="ProfileSetUp" component={ProfileScreen} /> */}
        <Stack.Screen name="Profile" component={NormalProfileScreen} />
        <Stack.Screen name="Medical" component={MedicalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
