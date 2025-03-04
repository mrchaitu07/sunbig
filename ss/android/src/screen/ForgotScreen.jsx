import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ForgetScreen = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  // Basic email validation
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  };

  // Request OTP
  const requestOTP = async (email) => {
    try {
      const response = await fetch('http://192.168.186.230:5001/request-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert('Success', 'A password reset code has been sent to your email!');
        navigation.navigate("SetPassword",{ email });
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error requesting OTP:', error);
      Alert.alert('Error', 'Failed to send OTP');
    }
  };

  const handleSendResetLink = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    requestOTP(email);
  };

  return (
    <View style={styles.container}>
      <View>
        <Image source={require("../assets/logintop.png")} style={styles.Top} />
      </View>
      <View style={styles.Text}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Enter your email address below to receive a password reset code.</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor={'black'}
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendResetLink} >
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 30,
    fontSize: 16,
    elevation: 20,
    color:'black'
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  Text: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  Top: {
    height: 300,
    width: 900,
  },
});

export default ForgetScreen;