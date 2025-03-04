import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, StatusBar, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.31.87:5001'; // Make sure this matches your backend URL

const HomeScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getUserData = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Try to get userData directly from AsyncStorage first (faster)
      const storedUserData = await AsyncStorage.getItem("userData");
      
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
      
      // Get the token (could be from regular login or OTP login)
      const token = await AsyncStorage.getItem("token");
      
      if (!token) {
        setError("You are not logged in");
        setLoading(false);
        // Redirect to login after a delay
        setTimeout(() => {
          navigation.replace("Login");
        }, 2000);
        return;
      }

      // Verify the token with the server and get latest user data
      const response = await axios.post(`${API_BASE_URL}/userdata`, { token });
      
      if (response.data.status === "Ok") {
        setUserData(response.data.data);
        // Update stored user data with latest from server
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.data));
      } else {
        throw new Error("Failed to get user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load your profile");
      
      // Check if the error is due to invalid token
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("userData");
        // Redirect to login
        setTimeout(() => {
          navigation.replace("Login");
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
    
    // Add focus listener to refresh data when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      getUserData();
    });
    
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D1A69" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="exclamation-circle" size={50} color="#FF6B6B" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ScrollView style={styles.scrollContainer}>
        <LinearGradient
          colors={['#0D1A69', '#01C1EE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        ></LinearGradient>

        <View style={styles.he}>
          <View style={styles.hellotext}>
            <Icon name="user-circle" size={40} color="white" />
            <Text style={styles.greeting}>Hello ! {userData?.name || "User"}</Text>
            <Icon name="bars" size={30} color="white" style={styles.menuIcon} onPress={() => {/* Handle menu press */}} />
          </View>
          <View style={styles.text}>
            <Text style={styles.subtitle}>Take smart decision today, Get solar for your <Text style={styles.boldText}>Home</Text></Text>
          </View>
          <TouchableOpacity style={styles.proposalButton}>
            <Text style={styles.proposalText}>GET A FREE PROPOSAL</Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal Scroll for "Solar for Home" */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          
            <TouchableOpacity onPress={() => navigation.navigate('SolarHome')}>
            <View style={styles.card}>
              <Image source={require('../assets/solar.jpg')} style={styles.image} />
              <Text style={styles.title}>Solar for Home</Text>
              </View>

            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('HousingS')}>


          <View style={styles.card}>
            <Image source={require('../assets/solar.jpg')} style={styles.image} />
            <Text style={styles.title}>Solar for Home</Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Zero')}>

          <View style={styles.card}>
            <Image source={require('../assets/solar.jpg')} style={styles.image} />
            <Text style={styles.title}>Solar for Home</Text>
          </View>
          </TouchableOpacity>

          <View style={styles.card}>
            <Image source={require('../assets/solar.jpg')} style={styles.image} />
            <Text style={styles.title}>Solar for Home</Text>
          </View>
        </ScrollView>

        <View style={styles.gridContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} 
              style={[styles.gridItem, activeTab === item.key && styles.activeGridItem]} 
              onPress={() => {
                if(item.key === 'loan'){
                  navigation.navigate('loan');
                } else if(item.key === 'profile') {
                  // Add profile navigation
                  navigation.navigate('Profile');
                } else {
                  setActiveTab(item.key);
                }
              }}>
              <Icon name={item.icon} size={25} color={activeTab === item.key ? 'white' : '#002F7A'} />
              <Text style={[styles.gridText, activeTab === item.key && styles.activeGridText]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        {bottomNavItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.navItem, activeTab === item.key && styles.activeNavItem]}
            onPress={() => {
              setActiveTab(item.key);
              if (item.key === 'profile') {
                navigation.navigate('');
              }
            }}
          >
            <Icon name={item.icon} size={24} color={activeTab === item.key ? '#002F7A' : 'black'} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const menuItems = [
  { key: 'quote', label: 'Get A   Quote', icon: 'file-text' },
  { key: 'call', label: 'Book a     Call', icon: 'phone' },
  { key: 'loan', label: 'Solar      Loan', icon: 'money' },
  { key: 'payment', label: 'Payment', icon: 'credit-card' },
  { key: 'documents', label: 'Project Documents', icon: 'folder' },
  { key: 'track', label: 'Track Project', icon: 'map-marker' },
  { key: 'monitor', label: 'Monitor Generation', icon: 'line-chart' },
  { key: 'refer', label: 'Refer &   Earn', icon: 'users' },
  { key: 'blog', label: 'SolaroPedia (Blog)', icon: 'newspaper-o' }
];

const bottomNavItems = [
  { key: 'home', icon: 'home' },
  { key: 'monitor', icon: 'line-chart' },
  { key: 'quote', icon: 'file-text' },
  { key: 'refer', icon: 'users' },
  { key: 'profile', icon: 'user-circle' }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEDFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECEDFF',
  },
  loadingText: {
    marginTop: 10,
    color: '#0D1A69',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECEDFF',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    color: '#FF6B6B',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1
  },
  header: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: 290
  },
  he: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: -280
  },
  greeting: {
    color: 'white',
    fontSize: 18,
    marginLeft: 18,
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
  },
  subtitle: {
    color: 'white',
    fontSize: 20,
    marginHorizontal: 50,
    fontFamily: 'Poppins-Regular',
    textAlign:'center'
  },
  boldText: {
    fontFamily: 'Poppins-Bold',
  },
  proposalButton: {
    backgroundColor: 'white',
    padding: 7,
    borderRadius: 15,
    alignItems: 'center',
    marginTop:-50,
    backgroundColor:'#0C1767',
    borderColor:'white',
    borderWidth:4,
    marginHorizontal:20,
    marginBottom:-5
  },
  proposalText: {
    color:'white',
    fontSize:17,
    fontFamily: 'Poppins-Bold',
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    marginTop:-5
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 15,
    marginHorizontal: 19.5,
    backgroundColor: 'white',
    borderColor: 'white',
    borderRadius: 15,
    borderTopWidth:15,
    borderBottomWidth:10
  },
  gridItem: {
    backgroundColor: '#ECEDFF',
    padding: 18,
    margin: 2,
    borderRadius: 20,
    alignItems: 'center',
    width: '30%',
  },
  gridText: {
    marginTop: 10,
    color: '#002F7A',
    fontSize: 13,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  activeGridItem: {
    backgroundColor: '#C6EAFF'
  },
  activeGridText: {
    color: 'black',
    fontFamily: 'Poppins-Bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius:20,
    borderBottomLeftRadius:20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  navItem: {
    padding: 10
  },
  activeNavItem: {
    backgroundColor: '#C6EAFF',
    borderRadius: 20,
    padding: 10
  },
  text: {
    marginVertical: 80,
  },
  hellotext: {
    flexDirection: 'row',
    marginLeft:10,
    marginTop:20
  },
  im:{
    borderRadius: 100,
  },
  stext:{
    fontSize:15,
    textAlign:'center',
    marginTop:5,
    fontFamily: 'Poppins-Bold',
    color: '#002F7A',
  },
  menuIcon: {
    marginLeft:100,
    marginTop:8,
    color:"#8CFEFF"
  },
  regular: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#333',
  },
  bold: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#000',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    margin: 3,
    height:95,
    marginTop:40,
    width:180,
  },
  image: {
    width: 170,
    height: 100,  
    borderRadius:10,
    marginTop:-55,
  },
  title: {
    fontSize: 17,
    marginTop:3,
    fontFamily: 'Poppins-Bold',
    color: '#002F7A',
    textAlign:'center'
  },
});

export default HomeScreen;