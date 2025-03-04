import axios from 'axios';
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Email validation regex (for correct email format)
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  // Password validation (minimum 8 characters)
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleLogin = async () => {
    let valid = true;

    // Reset error messages
    setEmailError('');
    setPasswordError('');
    setSuccessMessage(''); // Reset success message

    // Validate email
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }

    // Validate password
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters long.');
      valid = false;
    }

    if (!valid) return;

    const userData = {
      password: password,
      email: email,
    };

    try {
      const res = await axios.post("http://192.168.186.230:5001/login-user", userData);
      if (res.data.status === 'ok') {
        setSuccessMessage('Login successful!');
        await AsyncStorage.setItem("token", res.data.token); // Ensure token is stored
        navigation.navigate("Home");
      } else {
        Alert.alert('Login Failed', res.data.message || 'Invalid email or password.');
      }
    } catch (error) {
      Alert.alert('An error occurred', 'Invalid email or password.');
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Image source={require("../assets/logintop.png")} style={styles.topimage} />
      </View>
      <View style={styles.helloc}>
        <Text style={styles.helloText}>Hello</Text>
      </View>
      <View>
        <Text style={styles.signintext}>Sign In To Your Account</Text>
      </View>

      <View style={styles.inputc}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="black"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

      <View style={styles.inputc}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="black"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
      </View>
      <View>
        <Text style={styles.pass} onPress={() => navigation.navigate('Forgot')}>Forgot Your Password</Text>
      </View>
      <View style={styles.login}>
        <TouchableOpacity onPress={handleLogin} style={styles.login}>
          <Text style={styles.buttonText}>Sign in</Text>
          <Image source={require("../assets/signin.png")} style={styles.signin} />
        </TouchableOpacity>
      </View>
      <View style={styles.login}>
        <TouchableOpacity onPress={() => navigation.navigate('OTP')} style={styles.login}>
          <Text style={styles.buttonText}>OTP</Text>
          <Image source={require("../assets/signin.png")} style={styles.signin} />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.signupText}>
          Don't have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>Sign up</Text>
        </Text>

        {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}
      </View>
      <View>
        <Image source={require("../assets/side.png")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24, marginBottom: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 15, paddingLeft: 10, borderRadius: 20, elevation: 20, height: 50, color: 'black' },
  signupText: { textAlign: 'center', marginTop: 25 },
  link: { color: 'blue' },
  topimage: {
    width: 430,
    height: 140
  },
  helloc: {
    marginTop: 20
  },
  helloText: {
    textAlign: 'center',
    fontSize: 70,
    fontWeight: '700',
    color: 'black'
  },
  signintext: {
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
    marginBottom: 30
  },
  pass: {
    marginLeft: 220,
    fontSize: 16,
    marginBottom: 10,
  },
  inputc: {
    paddingLeft: 20,
    paddingRight: 20,
    elevation: 100,
    marginVertical: 15,
    marginHorizontal: 20,
  },
  btnv: {
    marginTop: 40,
    marginHorizontal: 70,
  },
  lbtn: {
    borderRadius: 20,
  },
  signin: {
    width: 80,
    height: 40,
    borderRadius: 20,
  },
  buttonText: {
    fontWeight: '900',
    fontSize: 20,
    paddingRight: 15
  },
  login: {
    flexDirection: 'row',
    marginHorizontal: 100,
    marginTop: 15
  },
  error: {
    color: 'red',
    marginBottom: 0,
    textAlign: 'center',
  },
  success: {
    color: 'green',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  }
});

export default LoginScreen;