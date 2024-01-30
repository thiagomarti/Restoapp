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

export default function RegisterScreen() {
  const [localName, setLocalName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigation = useNavigation();

  const handleRegister = () => {
    const local = localName.toUpperCase()
    const dueño = ownerName.toUpperCase()
    const categoryRef = ref(database, `${local}${dueño}`);
    const codigo = local + dueño;
    set(categoryRef, {password, localName})
    .then(() => {
        setMensaje('Registro exitoso');
      navigation.navigate("Dueño/Supervisor", {nombre: ownerName, codigo: codigo, Local: localName,})
    })
    .catch((error) => {
      console.error('Error de registro:', error);
    });
  };

  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold', paddingBottom: 30, textAlign: "center" }}>Registro</Text>
      <TextInput
        placeholder="Nombre del local"
        value={localName}
        onChangeText={setLocalName}
        style={{
            marginVertical: 8,
            height: 50,
            width: "90%",
            borderWidth: 1,
            borderColor: "black",
            color: '#00469B',
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 'bold',
          }}
      />
      <TextInput
        placeholder="Nombre del dueño"
        value={ownerName}
        onChangeText={setOwnerName}
        style={{
            marginVertical: 8,
            height: 50,
            width: "90%",
            borderWidth: 1,
            borderColor: "black",
            color: '#00469B',
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 'bold',
          }}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
            marginVertical: 8,
            height: 50,
            width: "90%",
            borderWidth: 1,
            borderColor: "black",
            color: '#00469B',
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 'bold',
          }}
      />
        <TouchableOpacity style={{width: 200, height: 80, backgroundColor: '#6CCCFC', borderWidth: 1, borderColor: 'black', borderRadius: 20, marginTop: 40, justifyContent: 'center', alignItems: 'center', }} onPress={handleRegister}><Text style={{fontSize: 20,}}>Registrarse</Text></TouchableOpacity>
      <Text style={{textAlign: 'center', marginTop: 16, color:"red"}}>{mensaje}</Text>
    </View>
  );
};

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
