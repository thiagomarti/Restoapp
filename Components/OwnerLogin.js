import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { getDatabase, ref, get } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { useNavigation, } from '@react-navigation/native';

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

const LoginScreen = () => {
  const [localName, setLocalName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigation = useNavigation();
  const local = localName.toUpperCase().trim()
  const dueño = ownerName.toUpperCase().trim()

  const handleLogin = () => {
    const categoryRef = ref(database, `${local}${dueño}`);
    const codigo = local + dueño;

    get(categoryRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const categoryData = snapshot.val();
          if (categoryData.password === password) {
            setMensaje('Inicio de sesión exitoso');
            navigation.navigate("Dueño/Supervisor", {nombre: ownerName, codigo: codigo, Local: localName,})
          } else {
            setMensaje('Contraseña incorrecta');
          }
        } else {
          setMensaje('El local no existe o nombre incorrecto');
        }
      })
      .catch((error) => {
        console.error('Error de inicio de sesión:', error);
      });
  };

  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold', paddingBottom: 30, textAlign: "center" }}>Iniciar Sesión</Text>
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
      <TouchableOpacity style={{width: 200, height: 80, backgroundColor: '#6CCCFC', borderWidth: 1, borderColor: 'black', borderRadius: 20, marginTop: 40, justifyContent: 'center', alignItems: 'center', }} onPress={handleLogin}><Text style={{fontSize: 20,}}>Iniciar Sesion</Text></TouchableOpacity>
      <Text style={{ textAlign: 'center', marginTop: 16, color: "red" }}>{mensaje}</Text>
    </View>
  );  
};

export default LoginScreen;

