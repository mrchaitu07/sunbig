import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const API_BASE_URL = 'http://192.168.31.87:5001'; // Update with your backend URL

const LoginWithOTP = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Changed to array for separate inputs
  const inputs = useRef([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Handle timer for OTP resend
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handle OTP digit input
  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    
    // Auto-focus to next input if text is entered
    if (text && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  // Handle OTP sending
  const handleSendOTP = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!phone || phone.length !== 10) {
      setErrorMessage('Enter a valid 10-digit phone number.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/send-otp`, { phone });
      
      if (response.data.success) {
        setIsOtpSent(true);
        setSuccessMessage('OTP sent successfully!');
        // Set resend timer to 60 seconds
        setResendTimer(60);
      } else {
        setErrorMessage(response.data.message || 'Failed to send OTP. Try again later.');
      }
    } catch (error) {
      console.error('Send OTP error:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || 'Failed to send OTP. Try again later.');
    }
    setIsLoading(false);
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    const otpString = otp.join('');
    if (!otpString || otpString.length !== 6) {
      setErrorMessage('Enter a valid 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, { 
        phone, 
        otp: otpString 
      });

      if (response.data.success) {
        // Store the token in AsyncStorage
        await AsyncStorage.setItem('token', response.data.token);
        
        // Store user data
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        
        setSuccessMessage('Login successful!');
        
        // Navigate to Home with a reset to prevent going back to login
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }, 1500);
      } else {
        setErrorMessage(response.data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || 'OTP verification failed. Try again.');
    }
    setIsLoading(false);
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient colors={['#0D1A69', '#01C1EE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradient}>
        
        <View>
          {!isOtpSent ? (
            <>
             <Text style={styles.title1}>OTP Verification</Text>
             <Icon style={styles.iconback} name="message-text-outline" size={50} color="#fff" />
              <Text style={styles.txtmsg}>Enter Your Mobile Number</Text>
              <Text style={styles.txtmsg2}>We will send you a OTP Message</Text>
            </>
          ) : (
            <>
             <Text style={styles.title1}>OTP Verification Code</Text>
             <Icon style={styles.iconback} name="message-text-outline" size={50} color="#fff" />
              <Text style={styles.txtmsg}>Enter OTP</Text>
              <Text style={styles.txtmsg2}>We Have Sent OTP On +91 {phone} </Text>
            </>
          )}
        </View>

        <View style={styles.white}>
          {!isOtpSent ? (
            <>
              <View style={styles.inputGroup1}>
                <TextInput
                  style={styles.input}
                  placeholder="(+91) India "
                  keyboardType="phone-pad"
                  placeholderTextColor={'#0a1172'}
                  editable={false}
                />
              </View>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter Your Mobile Number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholderTextColor={'#0a1172'}
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.otpInputContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputs.current[index] = ref)}
                    style={styles.otpBox}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    autoFocus={index === 0}
                  />
                ))}
              </View>
              
              {resendTimer > 0 ? (
                <Text style={styles.timerText}>Resend OTP in {resendTimer}s</Text>
              ) : (
                <TouchableOpacity onPress={handleSendOTP} disabled={isLoading}>
                  <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
      
          <View>
            {!isOtpSent ? (
              <TouchableOpacity style={styles.button} onPress={handleSendOTP} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>SEND OTP</Text>}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button1} onPress={handleVerifyOTP} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>VERIFY OTP</Text>}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  white: {
    backgroundColor: '#ECEDFF',
    height: '100%',
    width: '100%',
    marginTop: '10%',
    borderTopLeftRadius: 90,
    padding: 30,
    alignItems: 'center',
  },
  title1: {
    fontSize: 25,
    color: 'white',
    marginTop: 70,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  iconback: {
    marginLeft: 190,
    marginTop: 20
  },
  inputGroup1: {
    width: '100%',
    marginBottom: 12,
    marginTop: 70
  },
  inputGroup: {
    width: '100%',
    marginBottom: 12,
    marginTop: 50
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    fontSize: 15,
    color: "#0a1172",
    fontFamily: 'Poppins-Bold',
    textDecorationLine: 'none',
    borderWidth: 0,
    backgroundColor: '#ECEDFF',
    borderBottomColor: '#0a1172',
    textAlign: 'center',
    borderBottomWidth: 2
  },
  // New styles for OTP boxes
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 100,
    marginBottom: 15,
  },
  otpBox: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: '#0a1172',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: '#0a1172',
    marginHorizontal: 5,
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Poppins-Regular',
  },
  successText: {
    color: 'green',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Poppins-Regular',
  },
  button: {
    backgroundColor: '#0a1172',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 130,
    marginHorizontal: 25,
  },
  button1: {
    backgroundColor: '#0a1172',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 145,
    marginHorizontal: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    width: 300,
    textAlign: 'center'
  },
  resendText: {
    color: '#0a1172',
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Poppins-Medium',
  },
  timerText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Poppins-Regular',
  },
  txtmsg: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
    fontFamily: 'Poppins-Bold',
  },
  txtmsg2: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 12,
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
  }
});

export default LoginWithOTP;