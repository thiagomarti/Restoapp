import 'react-native-gesture-handler';
import { View, Text, Image, StyleSheet, TextInput, Button,Modal, FlatList, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { getDatabase, ref as sRef, onValue } from 'firebase/database';


import OwnerEmployer from './Components/OwnerEmployer';
import Owner from './Components/Owner';
import Employer from './Components/Employer';
import OwnerRegister from './Components/OwnerRegister';
import OwnerLogin from './Components/OwnerLogin';
import LoginRestForm from './Components/LoginRestForm';
import Adminprincipal from './Components/Admin';
import TablesBut from './Components/Mozo';
import ChefBox from './Components/Chef';
import BarraBox from './Components/Barra';
import CajaBox from './Components/Caja';
import { Console } from 'console';


const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen
          name="Own/employ"
          component={OwnerEmployer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Owner"
          component={OwnerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Employer"
          component={EmployerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OwnerRegister"
          component={OwnerRegister}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OwnerLogin"
          component={OwnerLoginScreen}
          options={{ headerShown: false }}
        />
      <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      <Stack.Screen
          name="Dueño/Supervisor"
          component={AdminScreen}
          options={{ headerShown: false, gestureEnabled: false,}}
        />
        <Stack.Screen
          name="Adminprincipal"
          component={Adminprincipal}
          options={{ headerShown: false}}
        />
        <Stack.Screen
          name="Cocinero"
          component={ChefScreen}
          options={{ headerShown: false, gestureEnabled: false, }}
        />
        <Stack.Screen
          name="Barra"
          component={BarraScreen}
          options={{ headerShown: false, gestureEnabled: false, }}
        />
        <Stack.Screen
          name="Mozo"
          component={WaiterScreen}
          options={{ headerShown: false, gestureEnabled: false, }}
        />
        <Stack.Screen
          name="Caja"
          component={CajaScreen}
          options={{ headerShown: false, gestureEnabled: false, }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function OwnerScreen () {
  return (
    <View style={styles.container}>
      <Owner/>
    </View>
  );
}

function EmployerScreen () {
  return (
    <View style={styles.container}>
      <Employer/>
    </View>
  );
}


function OwnerLoginScreen () {
  return (
    <View style={styles.container}>
      <OwnerLogin/>
    </View>
  );
}

function HomeScreen({route}) {
  const {codigo} = route.params;
  return (
    <View style={styles.container}>
      <LoginRestForm Codigo={codigo}/>
    </View>
  );
}

function AdminScreen({ route }) {
  const { nombre, codigo} = route.params;
  const navigation = useNavigation()
  return (
    <View style={{ flex: 1,}}>
      <View style={{backgroundColor: '#6CCCFC', flexDirection: 'row'}}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}><Text>Cerrar sesion</Text></TouchableOpacity>
      <Text style={{marginTop: 55, marginLeft: 'auto'}}>{nombre}  </Text>
      <Image
        source={require('./assets/images/user.png')}
        style={{ width:"8%", height:"35%", marginTop:"12%", marginRight:"3%"}}
      />
      </View>
      <Adminprincipal Codigo={codigo}/>
    </View>
  );
}
  
function WaiterScreen({ route }) {
  const navigation = useNavigation();
  const { nombre, codigo } = route.params;
  const comandasRef = sRef(getDatabase(), `${codigo}/comandas`);
  const BarraRef = sRef(getDatabase(), `${codigo}/comandasBarra`);
  const [modalVisible, setModalVisible] = useState(false);
  const [mesasComandas, setMesasComandas] = useState([]);
  const [barracocina, setbarracocina] = useState(""); 
  const [Barra, setBarra] = useState(""); 

  useEffect(() => {
    const playSound = () => {
      const audio = new Audio(ListoParaRetirarSound);
      audio.play();
    };

    onValue(comandasRef, (snapshot) => {
      if (snapshot.exists()) {
        const comandas = snapshot.val();
        const mesas = {};
  
        for (const comandaId in comandas) {
          if (comandas.hasOwnProperty(comandaId)) {
            const comanda = comandas[comandaId];
            const mesaKey = `${comanda.tipo} mesa ${comanda.mesa}`;
  
            if (!mesas[mesaKey]) {
              mesas[mesaKey] = [];
            }
  
            mesas[mesaKey].push({ id: comandaId, estado: comanda.estado });
  
            // Verifica si el estado de la comanda es "listo para retirar"
            if (comanda.Estado === "listo para retirar") {
            }
          }
        } 
  
        setMesasComandas(mesas);
      } else {
        setMesasComandas({});
      }
    });
  }, []);

  useEffect(() => {
    onValue(BarraRef, (snapshot) => {
      if (snapshot.exists()) {
        const comandas = snapshot.val();
        const mesas = {};
  
        for (const comandaId in comandas) {
          if (comandas.hasOwnProperty(comandaId)) {
            const comanda = comandas[comandaId];
            const mesaKey = `Bebidas mesa ${comanda.mesa}`;
  
            if (!mesas[mesaKey]) {
              mesas[mesaKey] = [];
            }
  
            mesas[mesaKey].push({ id: comandaId, estado: comanda.estado });
  
            // Verifica si el estado de la comanda es "listo para retirar"
            if (comanda.Estado === "listo para retirar") {
              //logica para el sonido
            }
          }
        } 
  
        setBarra(mesas);
      } else {
        setBarra({});
      }
    });
  }, []);

  const openModalCocina = () => {
    setbarracocina(mesasComandas)
    setModalVisible(true);
  };

  const openModalBarra = () => {
    setbarracocina(Barra)
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const ModalComponent = ({ visible, onClose }) => {
    return (
      <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}>
        <View style={{ flexDirection: 'row', backgroundColor: 'white', borderRadius: 10, borderColor: 'black', borderWidth: 1, margin: 10 }}>
        <View style={{ flex: 1, padding: 10 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'orange', textAlign: "center", marginTop: "5%", }}>En preparación:</Text>
        {Object.entries(barracocina).map(([mesa, comandas]) => (
          comandas.some(comanda => comanda.estado === 'en preparación') && (
            <Text style={{ fontSize: 15, textAlign: "center", marginTop: "5%" }} key={mesa}>
              {mesa}
            </Text>
          )
        ))}
      </View>
      <View style={{ width: 1, backgroundColor: 'black' }} />
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'green', textAlign: "center" }}>Para retirar:</Text>
        {Object.entries(barracocina).map(([mesa, comandas]) => (
          comandas.some(comanda => comanda.estado === 'listo para retirar') && (
            <Text style={{ fontSize: 15, textAlign: "center", marginTop: "5%" }} key={mesa}>
              {mesa}
            </Text>
          )
        ))}
      </View>
        </View>
  
        <TouchableOpacity onPress={onClose} style={{ backgroundColor: 'red', padding: 10, alignItems: "center", width:"50%", borderRadius: 15, }}>
          <Text style={{ color: "white", textAlign: "center", fontSize: 20 }}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
    );    
  };

  const barra = "Barra";
  const chef = "";

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}><Text>Cerrar sesión</Text></TouchableOpacity>
        <Text style={{ marginTop: 55, marginLeft: 'auto' }}> </Text>
          <TouchableOpacity style={{ maxWidth: "20%", maxHeight: "10%", }} onPress={openModalBarra}>
          <Image
            source={require('./assets/images/copa.png')}
            style={{ maxWidth: "70%", maxHeight: "450%", marginTop: "70%", marginRight: "3%" }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ maxWidth: "20%", maxHeight: "10%", }} onPress={openModalCocina}>
          <Image
            source={require('./assets/images/gorro.png')}
            style={{ maxWidth: "80%", maxHeight: "500%", marginTop: "60%", marginRight: "3%" }}
          />
        </TouchableOpacity>
        <ModalComponent
          visible={modalVisible}
          onClose={closeModal}
        />
      </View>
      <TablesBut nombre={nombre} codigo={codigo}/>
    </View>
  );
}


function ChefScreen({ route }) {
  const navigation = useNavigation();
  const { nombre, codigo} = route.params;
  return (
    <View style={styles.container}>
      <View style={{backgroundColor: '#6CCCFC', flexDirection: 'row'}}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}><Text>Cerrar sesion</Text></TouchableOpacity>
      <Text style={{marginTop: 55, marginLeft: 'auto'}}>{nombre}  </Text>
      <Image
        source={require('./assets/images/user.png')}
        style={{ width:"8%", height:"35%", marginTop:"12%", marginRight:"3%"}}
      />
      </View>
      <ChefBox nombre={nombre} codigo={codigo}/>
    </View>
  );
}

function BarraScreen({ route }) {
  const navigation = useNavigation();
  const { nombre, codigo} = route.params;
  return (
    <View style={styles.container}>
      <View style={{backgroundColor: '#6CCCFC', flexDirection: 'row'}}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}><Text>Cerrar sesion</Text></TouchableOpacity>
      <Text style={{marginTop: 55, marginLeft: 'auto'}}>{nombre}  </Text>
      <Image
        source={require('./assets/images/user.png')}
        style={{ width:"8%", height:"35%", marginTop:"12%", marginRight:"3%"}}
      />
      </View>
      <BarraBox nombre={nombre} codigo={codigo}/>
    </View>
  );
}

function CajaScreen({ route }) {
  const navigation = useNavigation();
  const { nombre, codigo} = route.params;
  return (
    <View style={styles.container}>
      <View style={{backgroundColor: '#6CCCFC', flexDirection: 'row'}}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}><Text>Cerrar sesion</Text></TouchableOpacity>
      <Text style={{marginTop: 55, marginLeft: 'auto'}}>{nombre}  </Text>
      <Image
        source={require('./assets/images/user.png')}
        style={{ width:"8%", height:"35%", marginTop:"12%", marginRight:"3%"}}
      />
      </View>
      <CajaBox nombre={nombre} codigo={codigo}/>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  logo: {
    width: 200,
    height: 150,
    marginTop: 60,
    marginBottom: 100,
    margin : '25%',
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
  navbar: {
    backgroundColor: '#6CCCFC',
    flexDirection: 'row',
  },
  back: {
    marginLeft: 15,
    marginTop: 35,
    backgroundColor: '#6CCCFC',
    flex: 0,
    width: 100,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    marginBottom: 8,
  },
});
