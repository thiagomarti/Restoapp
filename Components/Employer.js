import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
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

const EmployeeScreen = () => {
  const [code, setCode] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigation = useNavigation();
  const codigoo = code.toUpperCase().trim()

  const handleCheckCode = () => {
    const categoryRef = ref(database, `${codigoo}`);

    get(categoryRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setMensaje('Código válido');
          navigation.navigate('Home', { Codigo: codigoo });
        } else {
          setMensaje('Código no válido');
        }
      })
      .catch((error) => {
        console.error('Error al verificar el código:', error);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold', paddingBottom: 30, textAlign: "center" }}>Ingrese el código:</Text>
      <TextInput
        placeholder="Código"
        value={code}
        onChangeText={setCode}
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
            <TouchableOpacity style={{width: 200, height: 80, backgroundColor: '#6CCCFC', borderWidth: 1, borderColor: 'black', borderRadius: 20, marginTop: 40, justifyContent: 'center', alignItems: 'center', }} onPress={handleCheckCode}><Text style={{fontSize: 20,}}>Ingresar codigo</Text></TouchableOpacity>
      <Text style={{textAlign: 'center', marginTop: 16, color:"red"}}>{mensaje}</Text>
    </View>
    </TouchableWithoutFeedback>
  );
};

export default EmployeeScreen;
