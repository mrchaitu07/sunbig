import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';


import SplashScreen from 'react-native-splash-screen';
import LoginScreen from './android/src/screen/LoginScreen';
import SignupScreen from './android/src/screen/SignupScreen';
import ForgotScreen from './android/src/screen/ForgotScreen';
import setPassword from './android/src/screen/SetPassword';
import HomeScreen from './android/src/screen/HomeScreen';
import SetPassword from './android/src/screen/SetPassword';
import Loan from './android/src/screen/Loan';
import UploadLoanDOC from './android/src/screen/UpoloadLoanDOC';
import LoginWithOTP from './android/src/screen/LoginWithOtp';
import SolarHome from './android/src/screen/SolarHome';
import HousingSociety from './android/src/screen/HousingSociety';
import ZeroCostSolar from './android/src/screen/ZeroCostSolar';


const RootStack = createNativeStackNavigator()
 


const App = () => {
  useEffect(() => {
    // Hide splash screen after the app is ready
    SplashScreen.hide();

    // Optional: You can use a timer here to control how long the splash screen shows
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000); // Hide after 3 seconds
  }, []);

  return (

 
   <NavigationContainer>
    <RootStack.Navigator>
      <RootStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
      <RootStack.Screen  name="Forgot" component={ForgotScreen} options={{headerShown:false}}/>
      <RootStack.Screen name="SetPassword" component={SetPassword}options={{ headerShown: false }}/>
      <RootStack.Screen name="Home" component={HomeScreen}options={{ headerShown: false }}/>
      <RootStack.Screen name="Loan" component={Loan}options={{ headerShown: false }}/>
      <RootStack.Screen name="Upload" component={UploadLoanDOC} options={{headerShown:false}}/>
      <RootStack.Screen name="OTP" component={LoginWithOTP} options={{headerShown:false}}/>
      <RootStack.Screen name="SolarHome" component={SolarHome} options={{headerShown:false}}/>
      <RootStack.Screen name="HousingS" component={HousingSociety} options={{headerShown:false}}/>
      <RootStack.Screen name="Zero" component={ZeroCostSolar} options={{headerShown:false}}/>







      <RootStack.Screen name="SignUp" component={SignupScreen}options={{ headerShown: false }}/>


    </RootStack.Navigator>
    
   </NavigationContainer>



  );

};



export default App;
