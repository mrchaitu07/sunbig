import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';


import Icon from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';


import LinearGradient from 'react-native-linear-gradient';

const HousingSociety = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('quote');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Define bottom navigation items
  const bottomNavItems = [
    { key: 'home', icon: 'home' },
    { key: 'monitor', icon: 'line-chart' },
    { key: 'quote', icon: 'file-text' },
    { key: 'refer', icon: 'users' },
    { key: 'profile', icon: 'user-circle' }
  ];

  return (
    <View style={styles.container}>
     <StatusBar
             translucent
             backgroundColor="transparent"
             barStyle="light-content"
           />
            <ScrollView >

      {/* Gradient Header */}
      <LinearGradient
        colors={['#0D1A69', '#01C1EE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="menu" size={30} color="white" />
          </TouchableOpacity>
        </View>
        
        
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>SOLAR FOR HOUSING SOCIETY</Text>
          <Text style={styles.subtitle}>
            Take smart decision today,{'\n'}
            Get solar for your <Text style={styles.boldText}>Housing Society</Text>
          </Text>
        </View>
        
      </LinearGradient>
      
        {/* Category Cards */}
        <View style={styles.categoryGrid}>
          <TouchableOpacity style={styles.categoryCard}>
            <IconFA5 name="home" size={38} color="#000" />
            <Text style={styles.categoryText}>Solar for Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.categoryCard}>
          <Image source={require("../assets/university.png")} style={styles.topimg}/>
          <Text style={styles.categoryText}>Solar for School</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.categoryCard}>
          <Image source={require("../assets/hospital.png")} style={styles.topimg}/>
            <Text style={styles.categoryText}>Solar for Hospital</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.categoryCard}>
          <Image source={require("../assets/apartments.png")} style={styles.topimg}/>
            <Text style={styles.categoryText}>Solar for Housing Society</Text>
          </TouchableOpacity>
        </View>
        
        {/* Pricing Info Section */}
        <View style={styles.pricingSection}>
          <Text style={styles.pricingTitle}>
          Housing societies are spending more than 40% of money on electricity bill{'\n'}
            </Text> <Text style={styles.pricingTitle1}>
            of their monthly maintainence bill
          </Text>
          
          <View style={styles.pricingGrid}>
            <TouchableOpacity style={styles.pricingCard}>
            <Image source={require("../assets/battery.png")} style={styles.gimg}/>
            <Text style={styles.priceRange}>Rs. 11 - 22{'\n'}per unit</Text>
              <Text style={styles.priceLabel}>Backup Inverter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.pricingCard}>
               <Image source={require("../assets/generator.png")} style={styles.gimg}/>
              <Text style={styles.priceRange}>Rs. 15 - 24{'\n'}per unit</Text>
              <Text style={styles.priceLabel}>Diesel Generator</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.pricingCard}>
            <Image source={require("../assets/power.png")} style={styles.gimg}/>
            <Text style={styles.priceRange}>Rs. 6 - 19{'\n'}per unit</Text>
              <Text style={styles.priceLabel}>Grid Power</Text>
            </TouchableOpacity>

           
          </View>
          <View>
                <Text style={styles.bottomtxt}>And it is increasing at 7-20 % every year</Text>
            </View>
        </View>

        <View style={styles.pricingSection}>
          <Text style={styles.pricingTitle3}>
        
          But now <Text style={styles.boldText}>Housing Society</Text> can go <Text style={styles.boldText}>solar at zero investment</Text> and can control
          the electricity bills and get hugh savings, Because <Text style={styles.boldText}>SunBig Solar</Text> is offering
            <Text style={styles.boldText}> zero cost solar for housing societies</Text> at zero investment
          </Text>
          <Text style={styles.modeltxt}>Solar for Housing Society at Zero Investment Model</Text>
          
          <View style={styles.pricingGrid}>
            <TouchableOpacity style={styles.pricingCard2}>
            <Text style={styles.modelLabel}>Monthly ELectricity Bill Savings</Text>

            <Image source={require("../assets/1zeromodelimg.png")} style={styles.modelimg}/>
            <Text style={styles.priceLabel}>✔ Before Solar Monthly Electricity Bill</Text>
              <Text style={styles.priceLabel}>✔  After Zero Cost Solar Monthly Electricity Bill</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.pricingCard2}>
            <Text style={styles.modelLabel}>Yearly ELectricity Bill Savings</Text>

               <Image source={require("../assets/1.png")} style={styles.modelimg}/>
              <Text style={styles.priceLabel}>✔ Before Solar Electricity Bill Expenses Yearly</Text>
              <Text style={styles.priceLabel}>✔ After Zero Cost Solar Electricity Bill Savings Yearly</Text>
            </TouchableOpacity>
            
      

           
          </View>
          <View >
            <Text style={styles.getsolarbtn}>GET SOLAR NOW</Text>
            </View>
        </View>
        <View style={styles.worktxtview}>
          <Text style={styles.worktxt}>Benefits of Going Solar for Housing Society at Zero Investment Model</Text>
        </View>
        <View style={styles.workGrid}>
          <TouchableOpacity style={styles.workCard}>
          <Image source={require("../assets/4v.png")} style={styles.workimg}/>
            <Text style={styles.workText}>Zero Upfront Cost</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.workCard}>
          <Image source={require("../assets/3v.png")} style={styles.workimg}/>
          <Text style={styles.workText}>Zero Maintainence Cost</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.workCard}>
          <Image source={require("../assets/2v.png")} style={styles.workimg}/>
            <Text style={styles.workText}>Imidiate Payback Period</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.workCard}>
          <Image source={require("../assets/1v.png")} style={styles.workimg}/>
            <Text style={styles.workText}>Free Solar Power System</Text>
          </TouchableOpacity>
        </View>

        
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {bottomNavItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.navItem, 
              activeTab === item.key && styles.activeNavItem
            ]}
            onPress={() => {
              setActiveTab(item.key);
              if (item.key === 'profile' && navigation) {
                navigation.navigate('SolarHome');
              }
            }}
          >
            <IconFA 
              name={item.icon} 
              size={24} 
              color={activeTab === item.key ? '#002F7A' : 'black'} 
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEDFF',
  },
  headerGradient: {
    paddingTop: 10,
    height:280
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop:25
  },
  backButton: {
    padding: 5,
  },
  menuButton: {
    padding: 5,
    color:"#8CFEFF",
    marginRight:10

  },
  titleSection: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    // fontWeight: 800,
    // fontWeight:'bold',
    color: 'white',
    marginBottom: 5,
    fontFamily: 'Poppins-Bold',
    marginTop:-5
  },
  subtitle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    lineHeight: 30,
    fontFamily: 'Poppins-Regular',
    marginTop:15

  },
  boldText: {
    fontFamily: 'Poppins-Bold',
  },
  content: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // padding: 30,
    justifyContent: 'space-between',
    borderWidth:15,
    borderColor:'#fff',
    height:305,
    marginHorizontal:24,
    marginTop:-30,
    borderRadius:20,
    backgroundColor:'#fff',
    borderBottomWidth:10
  },
  workGrid: {
    flexDirection:'row',
    // flexWrap: 'wrap',
    // padding: 5,
    justifyContent: 'space-between',
    borderWidth:10,
    borderColor:'#fff',
    // height:305,
    marginHorizontal:24,
    marginTop:5,
    borderRadius:20,
    backgroundColor:'#fff',
    borderBottomWidth:1,
    marginBottom:10
    
  },
  categoryCard: {
    backgroundColor: '#C6EAFF',
    width: '49.3%',
    aspectRatio: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    padding: 10,
  },
  workCard: {
    backgroundColor: '#C6EAFF',
    width: '25%',
    aspectRatio: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    padding: 10,
    marginRight:8,
    marginLeft:-5,
    // height:100

    
  },
  categoryIcon: {
    width: 30,
    height: 30,
  },
  categoryIcon: {
    width: 30,
    height: 30,
  },

  workText: {
    marginTop: 5,
    fontSize: 11,
    // fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    color:'#0b2673',
    alignItems:'baseline',
    marginBottom:-15


  },
  categoryText: {
    marginTop: 8,
    fontSize: 17,
    // fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    color:'#0b2673',
    alignItems:'baseline',
    marginBottom:-15


  },
  pricingSection: {
    padding: 10,
    marginTop: 10,
    marginHorizontal:24,
    backgroundColor:'#fff',
    borderRadius:20
  },
  pricingTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: -30,
    lineHeight: 22,
    fontFamily: 'Poppins-Regular',
    color:'#0b2673',
    marginTop:1
    
    

  },
  pricingTitle1: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
    fontFamily: 'Poppins-Regular',
    color:'#0b2673',
    
    

  },
  pricingTitle3: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
    fontFamily: 'Poppins-Regular',
    color:'#0b2673',
    
    

  },
  pricingGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pricingCard: {
    width: '31%',
    backgroundColor: '#ecedff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  pricingCard2: {
    width: '49%',
    backgroundColor: '#ecedff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  priceRange: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 8,
    fontFamily: 'Poppins-Regular',
    color:'#0b2673'
  },
  priceLabel: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',

  },
  modelLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    paddingBottom:7

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
    padding: 8,
    alignItems: 'center',
  },
  activeNavItem: {
    backgroundColor: '#d9f0ff',
    borderRadius: 50,
    padding: 12,
    transform: [{translateY: -10}],
  },
  gimg:{
    height:30,
    width:30
  },
  topimg:{
    height:45,
    width:45
  },
  bottomtxt:{
    
    fontFamily: 'Poppins-Regular',
    fontSize:15,
    textAlign:'center',
    marginTop:10,
    color:'#0b2673'
  },
  modelimg:{
    height:100,
    width:170
  },
  modeltxt:{
    textAlign:'center',
    fontFamily:'Poppins-Regular',
    fontSize:20,
    color:'#0b2673'

  },
  getsolarbtn:{
    
    fontFamily: 'Poppins-Bold',
    fontSize:15,
    textAlign:'center',
    marginTop:10,
    color:'#0b2673',
    backgroundColor: '#C6EAFF',
    padding:8,
    marginHorizontal:24,
    borderRadius:20
  },
  worktxt:{
    textAlign:'center',
    fontFamily:'Poppins-Bold',
    fontSize:20,
    color:'#0b2673',
    marginTop:5,
  },
  worktxtview:{
    backgroundColor:'#fff',
    marginHorizontal:24,
    borderRadius:20,
    marginTop:5,
  }, 
  workimg:{
    width: 30,
    height: 30,
    marginTop:-10
  }
});

export default HousingSociety;