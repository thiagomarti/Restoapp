import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getDatabase, ref, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();


const firebaseConfig = {
    apiKey: "AIzaSyBZoCJQgmwqXltZbBWmkZ54stBlT6jf4Gs",
    authDomain: "restoapp-2e79a.firebaseapp.com",
    databaseURL: "https://restoapp-2e79a-default-rtdb.firebaseio.com",
    projectId: "restoapp-2e79a",
    storageBucket: "restoapp-2e79a.appspot.com",
    messagingSenderId: "300896535259",
    appId: "1:300896535259:web:33f41bd2627b410064c2fe",
    measurementId: "G-X9RC5LH6MK"
};

const app: FirebaseApp = initializeApp(firebaseConfig);

const database = getDatabase(app);


export default function function PlanOptions() {
  const navigation = useNavigation();
    return (
      <View style={styles.container}>
        <Image
        source={require('../assets/images/logo-restoapp.png')}
        style={{ width:"60%", height:"20%", marginBottom: 70,}}
      />
      <Text style={{ fontSize: 30, fontWeight: 'bold', paddingBottom: 30, textAlign: "center" }}>Elige un plan</Text>
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("payment", {precio: 10000, mesas: 15, empleados: 6,})}
        >
          <Text style={styles.optionText}>Plan Small</Text>
          <Text style={styles.optionDescription}>15 mesas</Text>
          <Text style={styles.optionDescription}>6 empleados</Text>
          <Text style={styles.optionPrice}> $10.000 x mes </Text>
        </TouchableOpacity>
  
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("payment", {precio: 20000, mesas: 30, empleados: 9,})}
        >
          <Text style={styles.optionText}>Plan Medium</Text>
          <Text style={styles.optionDescription}>30 mesas</Text>
          <Text style={styles.optionDescription}>9 empleados</Text>
          <Text style={styles.optionPrice}> $20.000 x mes </Text>
        </TouchableOpacity>
  
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("payment", {precio: 20000,})}
        >
          <Text style={styles.optionText}>Plan Big</Text>
          <Text style={styles.optionDescription}>50 o mas mesas</Text>
          <Text style={styles.optionDescription}>14 o mas empleados</Text>
          <Text style={styles.optionPrice}> $30.000 x mes </Text>
        </TouchableOpacity>
      </View>
    );
  }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "white"
    },
    option: {
      width: 300,
      height: 100,
      backgroundColor: '#6CCCFC',
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 20,
      marginBottom: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    optionText: {
      fontWeight: 'bold',
      fontSize: 20,
    },
    optionDescription: {
      fontSize: 16,
    },
    optionPrice: {
        fontSize: 16,
        color:"white",
        backgroundColor: "#00469B"
      },
  });
