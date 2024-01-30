import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { FirebaseApp, initializeApp } from "firebase/app";
import { getDatabase, onValue, ref as sRef, set, remove } from "firebase/database";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';

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

const Stack = createNativeStackNavigator();

function CajaScreen() {
    const route = useRoute();
    const { codigo } = route.params;
    const [MesasCerradas, setMesasCerradas] = useState([]);
    const mesasRef = sRef(database, `${codigo}/Mesascerradas`);
  
    useEffect(() => {
      // Escuchar cambios en la ubicación de mesas cerradas
      const unsubscribe = onValue(mesasRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const mesasCerradasArray = Object.values(data);
          setMesasCerradas(mesasCerradasArray);
        } else {
          setMesasCerradas([]);
        }
      });
  
      return () => {
        // Detener la escucha cuando se desmonte el componente
        unsubscribe();
      };
    }, []);

    const marcarComandaComoTerminado = (mesanum) => {
    const borrarref = sRef(database, `${codigo}/Mesascerradas/` + `Mesa${mesanum}cerrada`);
    remove(borrarref)
    }

    const calcularTotalPedido = (elementos) => {
      let total = 0;
    
      elementos.forEach((elemento) => {
        const precio = parseFloat(elemento.precio);
        total += precio;
      });
      
    
      return total;
    }
    
    
  
    const agruparElementosPorNombre = (elementos) => {
      const agrupados = {};
  
      elementos.forEach((elemento) => {
        const key = `${elemento.nombre}-${elemento.variante || ''}`;
        if (agrupados[key]) {
          agrupados[key].cantidad++;
        } else {
          agrupados[key] = { ...elemento, cantidad: 1 };
        }
      });
  
      return Object.values(agrupados);
    };
  
    return (
      <View style={{alignItems: "center" }}>
        <Text style={{fontSize: 24, fontWeight: 'bold', marginTop: 30, marginBottom: 30, color: "#00469B", borderRadius: 20, }}>Mesas Cerradas</Text>
        <FlatList
          data={MesasCerradas}
          keyExtractor={(item) => Object.keys(item)[0]}
          renderItem={({ item }) => {
            const mesaData = Object.values(item)[0];
            const mesanum = mesaData.mesa
            const carritoo = mesaData.carrito
            const totalPedido = calcularTotalPedido(carritoo);
  
            return (
              <View style={{ padding: 10, borderColor: 'black', borderWidth: 1, margin: 10, alignItems: "center" }}>
                <Text style={{fontWeight: 'bold', fontSize: 18, color: "#00469B" }}>Mozo:</Text>
                <Text>{mesaData.mozo}</Text>
                <Text style={{fontWeight: 'bold', fontSize: 18, color: "#00469B" }}>Mesa:</Text>
                <Text>{mesaData.mesa}</Text>
                <Text style={{fontWeight: 'bold', fontSize: 18, color: "#00469B" }}>Pedido:</Text>
                {agruparElementosPorNombre(mesaData.carrito).map((elemento, index) => (
                <View>
                <Text>
                •{elemento.nombre}{elemento.variante ? (
                    <Text> {elemento.variante}</Text>
                ) : null} X{elemento.cantidad} <Text style={{ backgroundColor: "#6CCCFC" }}> ${elemento.precio} </Text>
                </Text>
              </View>
            ))}
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "#00469B" }}>Total del Pedido:</Text>
              <Text>${totalPedido}</Text>
                <TouchableOpacity onPress={() => marcarComandaComoTerminado(mesanum)}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: "white", backgroundColor: "red" }}>  Marcar como terminada  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    );
  } 

export default CajaScreen;