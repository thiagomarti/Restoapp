import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, TextInput, Button } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useNavigation, } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';

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
const Stack = createNativeStackNavigator();


export default function Formulario() {
  const navigation = useNavigation();

    return (
    <SafeAreaView style={styles.container}>
    <Image
        source={require('../assets/images/logo-restoapp.png')}
        style={styles.logo}
    />
        <View style={{height: 80, backgroundColor: '#6CCCFC', justifyContent: "center",}} >
            <Text style={{width: "100%", textAlign: "center", fontSize: 20,}} >Elige una opción</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <TouchableOpacity onPress={() => navigation.navigate("OwnerRegister")} style={styles.button}>
            <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("OwnerLogin")} style={styles.button}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        </View>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loginregister: {
    width: "100%",
    height:"100%",
    justifyContent:"center",
    alignContent: "center",
  },
  logo: {
    width: 200,
    height: 150,
    marginTop: 0,
    marginBottom: 60,
    margin: "25%",
  },
  line: {
    backgroundColor: '#6CCCFC',
  },
  button: {
    width: 300,
    height: 100,
    backgroundColor: '#6CCCFC',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    marginBottom: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});
