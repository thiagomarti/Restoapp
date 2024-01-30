// Formulario.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, Image, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { Appbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FirebaseApp, initializeApp } from "firebase/app";
import { getDatabase, onValue, ref as sRef} from "firebase/database";


export default function Formulario() {
    const [nombre, setNombre] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [empleados, setEmpleados] = useState([]);
    const navigation = useNavigation();
    const route = useRoute();
    const Codigo = route.params.Codigo


    useEffect(() => {
      // Configura Firebase
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
    const Empleados = sRef(database, `${Codigo}/Empleados`);

    const unsubscribe = onValue(Empleados, (snapshot) => {
        const data = snapshot.val();
        const empleadosArray = Object.values(data);
            setEmpleados(empleadosArray);
    });
    }, []);

    const verificarCuenta = () => {
        const cuentaEncontrada = empleados.find(
        (cuenta) =>
            cuenta.nombre === nombre &&
            cuenta.contrasena === contrasena
        );
            
        if (cuentaEncontrada) {
        const profesion = cuentaEncontrada.puesto;
        const nombre = cuentaEncontrada.nombre;
        navigation.navigate(profesion, { nombre: nombre, codigo: Codigo,});
        setMensaje('¡Acceso concedido!');
        } else {
        setMensaje('Credenciales incorrectas. Inténtalo de nuevo.');
        }
    };

return (
<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <SafeAreaView style={styles.container}>
        <Image
        source={require('../assets/images/logo-restoapp.png')}
        style={styles.logo}
        />
            <View style={{height: 80, backgroundColor: '#6CCCFC', justifyContent: "center",}} >
            <Text style={{width: "100%", textAlign: "center", fontSize: 20,}} >Formulario de Acceso</Text>
        </View>
    <View style={styles.form}>
        <TextInput
            label="Nombre"
            value={nombre}
            onChangeText={(text) => setNombre(text)}
            style={styles.input}
        />
        <TextInput
            label="Contraseña"
            secureTextEntry
            value={contrasena}
            onChangeText={(text) => setContrasena(text)}
            style={styles.input}
        />
        <Button title="Ingresar" onPress={verificarCuenta} style={styles.boton} />
        <Text style={styles.mensaje}>{mensaje}</Text>
    </View>
    </SafeAreaView>
</TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
},
logo: {
    width: 200,
    height: 150,
    marginTop: 0,
    marginBottom: 60,
    margin : '25%',
},
line: {
    backgroundColor: '#6CCCFC',
},
form: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-evenly',
},
input: {
    marginVertical: 8,
    height: 60,
    borderWidth: 1,
    borderColor: "black",
    color: '#00469B',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
},
boton: {
    backgroundColor: '#6CCCFC',
    color: '#6CCCFC',
},
mensaje: {
    textAlign: 'center',
    marginTop: 16,
},
});
