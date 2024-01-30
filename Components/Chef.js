import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TouchableHighlight, StyleSheet } from 'react-native';
import { FirebaseApp, initializeApp } from "firebase/app";
import { getDatabase, onValue, ref as sRef, set, remove, update } from "firebase/database";
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


function ChefScreen() {
  const route = useRoute();
  const { codigo } = route.params;
  const comandasRef = sRef(getDatabase(), `${codigo}/comandas`);
  const [comandas, setComandas] = useState([]);

  useEffect(() => {
    const unsubscribe = onValue(comandasRef, (snapshot) => {
      if (snapshot.exists()) {
        const comandasData = snapshot.val();
        const comandasArray = Object.entries(comandasData).map(([comandaId, comanda]) => ({
          id: comandaId,
          ...comanda,
          fecha: comanda.fecha ? new Date(comanda.fecha) : new Date(),
        }));

        const comandasOrdenadas = comandasArray.sort((a, b) => b.fecha - a.fecha);

        setComandas(comandasOrdenadas);
      } else {
        setComandas([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleEditEstado = (comandaId, estado) => {
    update(sRef(database, `${codigo}/comandas/${comandaId}`), { estado: estado });
  };

  const handleDeleteComanda = (comandaId) => {
    const borrarref = sRef(database,`${codigo}/comandas/${comandaId}`);
    remove(borrarref);
  };

  const agruparElementos = (elementos) => {
    const agrupados = {};
  
    Object.values(elementos).forEach((elemento) => {
      const key = `${elemento.elemento} - ${elemento.variante || ''}`;
      if (agrupados[key]) {
        agrupados[key].cantidad++;
      } else {
        agrupados[key] = { ...elemento, cantidad: 1 };
      }
    });
  
    return Object.values(agrupados);
  };  

  const renderComandas = () => {
    return comandas.map((comanda) => (
      <View key={comanda.id} style={styles.comandaContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Mesa: {comanda.mesa}</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>{comanda.tipo}</Text>
      </View>
      <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Estado: {comanda.estado}</Text>
      <View style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>
          {agruparElementos(comanda.elementos).map((elemento) => (
            <Text style={{ textAlign: 'center', fontSize: 18 }} key={elemento.elemento}>
              {`${elemento.elemento} x ${elemento.cantidad}`}
            </Text>
          ))}
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.preparacion} onPress={() => handleEditEstado(comanda.id, 'en preparación')}>
            <Text>En Preparación</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listo} onPress={() => handleEditEstado(comanda.id, 'listo para retirar')}>
            <Text>Listo para Retirar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.eliminar} onPress={() => handleDeleteComanda(comanda.id)}>
            <Text>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {renderComandas()}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  preparacion: {
    backgroundColor: "#FFA26F",
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius: 5,
  },
  listo: {
    backgroundColor: "#9DFF6F",
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius: 5,
  },
  eliminar: {
    backgroundColor: "#FF8585",
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius: 5,
  },
  mesaContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  mesaText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  comandaContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    alignContent: "center",
    justifyContent: "center",    
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },
});

export default ChefScreen;
