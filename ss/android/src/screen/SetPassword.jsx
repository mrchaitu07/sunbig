import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SetPassword = ({ route }) => {
  // const [email, setEmail] = useState('');
  const { email } = route.params;

  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();


  // const requestOtp = async () => {
  //   if (!email) {
  //     setMessage('Please enter your email');
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const response = await fetch('http://192.168.60.48:5001/request-reset', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email: email.trim() }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       setMessage('OTP sent successfully. Check your email.');
  //     } else {
  //       setMessage(data.message || 'Failed to send OTP');
  //     }
  //   } catch (error) {
  //     console.error('Network error:', error);
  //     setMessage('Network error occurred');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const resetPassword = async () => {
    if (!email || !resetCode || !newPassword || !confirmPassword) {
      setMessage('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://192.168.186.230:5001/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          resetCode: resetCode.trim(),
          newPassword
        })
      });

      const textResponse = await response.text();
      console.log('Server Response:', textResponse);

      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        data = { message: textResponse };
      }

      if (response.ok) {
        setMessage('Password reset successful');
        setTimeout(() => {
          navigation.navigate("Login");
        }, 2000);
      } else {
        setMessage(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Network error:', error);
      setMessage('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Image source={require("../assets/logintop.png")} style={styles.Top} />
      </View>
      <View style={styles.Text}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>{message}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={'black'}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Reset OTP"
        placeholderTextColor={'black'}
        value={resetCode}
        onChangeText={(text) => setResetCode(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={'black'}
        value={newPassword}
        onChangeText={(text) => setNewPassword(text)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor={'black'}
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
      />
      {/* <TouchableOpacity style={styles.button} onPress={requestOtp} disabled={loading}>
        <Text style={styles.buttonText}>Request OTP</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.button} onPress={resetPassword} disabled={loading}>
        <Text style={styles.buttonText}>Reset Password</Text>
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
    marginBottom: 10,
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
    height: 200,
    width: 500
  }
});

export default SetPassword;