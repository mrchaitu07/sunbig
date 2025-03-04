import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const SubmitForm = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [solarSystemSize, setSolarSystemSize] = useState('');
  const [occupation, setOccupation] = useState('');
  const [annualincome, setannualincome] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const occupationTypes = [
    'Select Occupation',
    'Business Owner',
    'Employee',
    'Self Employed',
    'Student',
    'Retired',
    'Other'
  ];
  
  const AnnualIncome = [
    'Select Annual Income',
    'Less than 5 Lakh',
    '5-10 Lakh',
    'More than 10 Lakh',
    
  ];

  const handleSubmit = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!name || !phone || !email || !address || !landmark || !solarSystemSize || !occupation || occupation === 'Select Occupation' || !annualincome || annualincome === 'Select Annual Income') {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.186.230:5001/loan', {
        name,
        phone,
        email,
        address,
        landmark,
        solarSystemSize,
        occupation,
        annualincome
      });

      if (response.status === 200) {
        setSuccessMessage('Loan application submitted successfully!');
        // Clear form
        setName('');
        setPhone('');
        setEmail('');
        setAddress('');
        setLandmark('');
        setSolarSystemSize('');
        setOccupation('Select Occupation');
        setannualincome('Select Annual Income');
        
        navigation.navigate('Upload');
      }
    } catch (error) {
      console.error('Error submitting loan application:', error);
      setErrorMessage('Failed to submit loan application. Please try again.');
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
          <Text style={styles.title1}>Apply For Solar Loan</Text>
        </View>

        <View style={styles.white}>
          <View style={styles.inputGroup}>
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
              <Text style={styles.inputLabel}>Nearest Landmark</Text>
              <TextInput
                style={styles.input}
                value={landmark}
                onChangeText={setLandmark}
                placeholder="Enter Nearest Landmark"
                placeholderTextColor={'#0a1172'}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Proposed Rooftop Solar System Size</Text>
              <TextInput
                style={styles.input}
                value={solarSystemSize}
                onChangeText={setSolarSystemSize}
                placeholder="Enter System Size (e.g., 5 kW)"
                placeholderTextColor={'#0a1172'}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Occupation Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={occupation}
                  onValueChange={(itemValue) => setOccupation(itemValue)}
                  style={styles.picker}
                  dropdownIconColor="#0a1172"
                >
                  {occupationTypes.map((type, index) => (
                    <Picker.Item 
                      key={index} 
                      label={type} 
                      value={type} 
                      color="white"
                      style={styles.pickerItem}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Annual Income</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={annualincome}
                  onValueChange={(itemValue) => setannualincome(itemValue)}
                  style={styles.picker}
                  dropdownIconColor="#0a1172"
                >
                  {AnnualIncome.map((type, index) => (
                    <Picker.Item 
                      key={index} 
                      label={type} 
                      value={type} 
                      color="white"
                      style={styles.pickerItem}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          {successMessage ? (
            <Text style={styles.successText}>{successMessage}</Text>
          ) : null}
        </View>
      </LinearGradient>
      <View>
        <TouchableOpacity style={styles.loanButton} onPress={handleSubmit}>
          <Text style={styles.ButtonText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
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
    marginTop: '4%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    color: 'white',
    fontWeight: '900',
    marginTop: 32,
    marginLeft: 30
  },
  title1: {
    fontSize: 25,
    color: 'white',
    marginLeft: 22,
    marginTop: 30,
    fontFamily: 'Poppins-Bold',
  },
  iconback: {
    flexDirection: 'row',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 10,
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
  pickerContainer: {
    marginLeft: 20,
    marginRight: 20,
    color: 'white'
  },
  picker: {
    color: '#0a1172',
    marginLeft: -8,
    marginTop: -15,
    height: 50,
    placeholder: 'Select',
  },
  pickerItem: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: -11,
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    fontSize: 16,
    marginBottom: -11,
    textAlign: 'center',
  },
  loanButton: {
    backgroundColor: '#0a1172',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 25
  },
  ButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SubmitForm;