import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image, TouchableOpacity, Alert, StatusBar } from 'react-native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

const SignupScreen = ({ navigation }) => {
  // Consolidated state variables
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [referralCode, setReferralCode] = useState('');

  // Error handling
  const [emailError, setEmailError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleSignup = async () => {
    let valid = true;

    // Reset error messages
    setEmailError('');
    setErrorMessage('');
    setSuccessMessage('');

    // Validate email
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }

    // Check if name and phone are provided
    if (!name.trim()) {
      setErrorMessage('Name is required');
      valid = false;
    } else if (!phone.trim()) {
      setErrorMessage('Phone number is required');
      valid = false;
    }

    // If validation passes, proceed with registration
    if (valid) {
      const userData = {
        name,
        email,
        phone,
        address,
        referralCode
      };

      try {
        // Update with your server's IP address/domain
        const response = await axios.post("http://192.168.31.87:5001/register", userData);
        
        if (response.data.status === "ok") {
          setSuccessMessage('Registration successful!');
          setTimeout(() => {
            navigation.navigate('Login');
          }, 1500);
        } else {
          setErrorMessage(response.data.data || 'Registration failed');
        }
      } catch (error) {
        console.error('Registration error:', error);
        setErrorMessage('Server error. Please try again later.');
      }
    }
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['#0D1A69', '#01C1EE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.iconback}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Icon name="arrow-left" size={24} color="white" style={styles.title} />
          </TouchableOpacity>
          <Text style={styles.title1}>Sign Up</Text>
        </View>

        <View style={styles.white}>
          <View style={styles.inputGroup1}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter Name"
                placeholderTextColor={'#0a1172'}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter Phone Number"
                keyboardType="phone-pad"
                placeholderTextColor={'#0a1172'}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email ID</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter Email ID"
                keyboardType="email-address"
                placeholderTextColor={'#0a1172'}
              />
            </View>
          </View>
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter Address"
                placeholderTextColor={'#0a1172'}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Referral Code (Optional)</Text>
              <TextInput
                style={styles.input}
                value={referralCode}
                onChangeText={setReferralCode}
                placeholder="Enter Referral Code"
                placeholderTextColor={'#0a1172'}
              />
            </View>
          </View>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          {successMessage ? (
            <Text style={styles.successText}>{successMessage}</Text>
          ) : null}
     
          <View style={styles.loanview}>
            <TouchableOpacity style={styles.loanButton} onPress={handleSignup}>
              <Text style={styles.ButtonText}>SUBMIT</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signInText}>
            <Text style={styles.signInText1}>
              Already have an account?{' '}
              <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Sign In</Text>
            </Text>
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
    height: '90%',
    width: '100%',
    marginTop: '10%',
    borderTopLeftRadius: 90,
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    color: 'white',
    fontWeight: '900',
    marginTop: 50,
    marginLeft: 30,
  },
  title1: {
    fontSize: 25,
    color: 'white',
    marginLeft: 100,
    marginTop: 50,
    fontFamily: 'Poppins-Bold',
    alignItems:'center',
  },
  iconback: {
    flexDirection: 'row',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 15,
  },
  inputGroup1:{
    width: '100%',
    marginBottom: 15,
    marginTop:30
  },
  inputWrapper: {
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 10,
    marginHorizontal:15
  },
  inputLabel: {
    color: '#0a1172',
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 20,
    fontFamily: 'Poppins-Bold',
  },
  input: {
    padding: 0,
    fontSize: 14,
    color: "#0a1172",
    marginLeft: 20,
    fontFamily: 'Poppins-Regular',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  loanButton: {
    backgroundColor: '#0a1172',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    // marginHorizontal: 45,
    textAlign:'center'
  },
  ButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    width:300,
    textAlign:'center'
  },
  signInText:{
    alignItems:'center',
    marginBottom:120,
  },
  signInText1:{
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#0a1172',
  },
  link: {
    color: '#0D1A69',
    fontWeight: 'bold',
  },
  loanview:{
    padding:10
  }
});

export default SignupScreen;