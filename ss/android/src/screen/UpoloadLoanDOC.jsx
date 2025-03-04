import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
  ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Upload = () => {
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [documents, setDocuments] = useState({
    panCard: null,
    aadharCard: null,
    salarySlip: null,
    itr: null
  });

  const pickDocument = async (documentType) => {
    try {
      // Allow both images and PDFs
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        allowMultiple: false,
      });

      const file = result[0];
      setDocuments(prev => ({
        ...prev,
        [documentType]: file
      }));
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const uploadDocument = async (documentType, file) => {
    if (!file) return null;
  
    const formData = new FormData();
    formData.append('files', {
      uri: file.uri,
      type: file.type || 'application/pdf',
      name: file.name || 'document.pdf',
    });
  
    try {
      const token = await AsyncStorage.getItem('token'); // Get token from storage
      const response = await axios.post('http://192.168.186.230:5001/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Include token in headers
        },
      });
      return response.data.files[0].url;
    } catch (error) {
      throw new Error(`Failed to upload ${documentType}: ${error.message}`);
    }
  };

  const DocumentUploadSection = ({ title, documentType }) => (
    <View style={styles.inputGroup}>
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>{title}</Text>
        <View style={styles.pan}>
          <Icon name="cloud-upload" size={30} color={'#0a1172'} />
          <TouchableOpacity onPress={() => pickDocument(documentType)}>
            <Text style={styles.UP}>Upload File</Text>
          </TouchableOpacity>
        </View>
        {documents[documentType] && (
          <View style={styles.filePreview}>
            {documents[documentType].type.startsWith('image/') ? (
              <Image 
                source={{ uri: documents[documentType].uri }} 
                style={styles.previewImage}
              />
            ) : (
              <View style={styles.pdfPreview}>
                <Icon name="file-pdf-o" size={40} color={'#0a1172'} />
                <Text style={styles.fileName}>{documents[documentType].name}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );

  const handleSubmit = async () => {
    try {
      setErrorMessage('');
      setSuccessMessage('');

      const missingDocs = Object.entries(documents)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

      if (missingDocs.length > 0) {
        setErrorMessage(`Please upload all required documents. Missing: ${missingDocs.join(', ')}`);
        return;
      }

      const uploadPromises = Object.entries(documents).map(async ([type, file]) => {
        const url = await uploadDocument(type, file);
        return { type, url };
      });

      await Promise.all(uploadPromises);
      
      setSuccessMessage('All documents uploaded successfully!');
      navigation.navigate('Home');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Keep your existing return JSX and styles...
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

        <ScrollView style={styles.scrollContainer}>
          <View style={styles.white}>
            <View style={styles.maintext}>
              <Text style={styles.htext}>Upload Documents Details as follows:</Text>
            </View>

            <DocumentUploadSection title="PAN CARD" documentType="panCard" />
            <DocumentUploadSection title="Aadhar Card" documentType="aadharCard" />
            <DocumentUploadSection title="Income Proof (6 Month's Salary Slip)" documentType="salarySlip" />
            <DocumentUploadSection title="Last 3 Year ITR" documentType="itr" />

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            {successMessage ? (
              <Text style={styles.successText}>{successMessage}</Text>
            ) : null}
          </View>
        </ScrollView>
      </LinearGradient>
      <View style={styles.btn}>
        <TouchableOpacity style={styles.loanButton} onPress={handleSubmit}>
          <Text style={styles.ButtonText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  filePreview: {
    marginTop: 10,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  pdfPreview: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: {
    marginTop: 10,
    color: '#0a1172',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },

  btn:{
    backgroundColor:'#ECEDFF',
    opacity:1,
  
  },
  gradient: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  white: {
    backgroundColor: '#ECEDFF',
    minHeight: '100%',
    width: '100%',
    marginTop: '6%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 30,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 30,
    color: 'white',
    // fontWeight: '900',
    fontFamily: 'Poppins-Bold',

    marginTop: 70,
    marginLeft: 30
  },
  title1: {
    fontSize: 25,
    color: 'white',
    // fontWeight: '900',
    marginLeft: 22,
    marginTop: 70,
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
    padding: 13,
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
    fontSize: 16,
    color: "#0a1172",
    marginLeft: 20,
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
    // width: '100%',
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
  htext: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#0a1172'

  },
  pan: {
    flexDirection: 'row',
    marginLeft: 15
  },
  UP: {
    fontFamily: 'Poppins-Regular',
    marginLeft: 10,
    marginTop: 5,
    fontSize: 16,
    color: '#0a1172'

  },
  maintext: {
    marginBottom: 25
  }

});

export default Upload;