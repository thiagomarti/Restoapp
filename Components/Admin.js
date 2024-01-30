import { View, ScrollView, Text, Image, StyleSheet, TextInput, FlatList, SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FirebaseApp, initializeApp } from "firebase/app";
import { getDatabase, onValue, push, update, off, remove, get  } from "firebase/database";
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import CheckBox from 'expo-checkbox';
import { ref as sRef } from "firebase/database";




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

export default function App({ Codigo, Local, nombre }) {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator>
                <Stack.Screen
                name="Principal"
                component={Principal}
                options={{ headerShown: false }}
                initialParams={{ Codigo: Codigo }}
                />
                <Stack.Screen
                name="Resto"
                component={InfoResto}
                options={{ headerShown: false }}
                initialParams={{ Codigo: Codigo, local: Local, nombre: nombre, }}
                />
            <Stack.Screen
                name="Food"
                component={Subcategoria}
                options={{ headerShown: false }}
                initialParams={{ Codigo: Codigo }}
            />
            <Stack.Screen
                name="Menu"
                component={CrearMenu}
                options={{ headerShown: false }}
                initialParams={{ Codigo: Codigo }}
            />
            <Stack.Screen
                name="Comida"
                component={CrearMenuComida}
                options={{ headerShown: false }}
                initialParams={{ Codigo: Codigo }}
            />
            <Stack.Screen
                name="Bebida"
                component={CrearMenuBebida}
                options={{ headerShown: false }}
                initialParams={{ Codigo: Codigo }}
            />
            <Stack.Screen
                name="registro"
                component={RegistroEmpleado}
                options={{ headerShown: false }}
                initialParams={{ Codigo: Codigo }}
            />
            <Stack.Screen
                name="infoempleados"
                component={MozoCierres}
                options={{ headerShown: false }}
                initialParams={{ Codigo: Codigo }}
            />
        </Stack.Navigator>
        </NavigationContainer>
    );
}

function Principal() {
  const navigation = useNavigation()
  const route = useRoute();
  const Codigo = route.params.Codigo
  return(
    <View style={{backgroundColor:"white", height: "100%",}}>
    <Text style={{fontSize: 24, fontWeight: 'bold', color:"#00469B", marginBottom: 16, marginTop: 50, textAlign:"center",}}>Sección de administrador</Text>
    <View style={styles.botones}>
      <TouchableOpacity onPress={() => navigation.navigate("Resto")}style={{justifyContent: 'center', alignItems: 'center', textAlign:"center", width: 200, height: 60, backgroundColor: '#6CCCFC', borderWidth: 1, borderColor: "black", borderRadius: 20, marginBottom: 30,}}><Text style={{fontWeight: 'bold',}}>Administrar info del restaurante</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Menu")}style={{justifyContent: 'center', alignItems: 'center', width: 200, height: 60, backgroundColor: '#6CCCFC', borderWidth: 1, borderColor: "black", borderRadius: 20, marginBottom: 30,}}><Text style={{fontWeight: 'bold',}}>Administrar menu</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("registro")}style={{justifyContent: 'center', alignItems: 'center', width: 200, height: 60, backgroundColor: '#6CCCFC', borderWidth: 1, borderColor: "black", borderRadius: 20, marginBottom: 30,}}><Text style={{fontWeight: 'bold',}}>Administrar empleados</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("infoempleados")}style={{justifyContent: 'center', alignItems: 'center', width: 200, height: 60, backgroundColor: '#6CCCFC', borderWidth: 1, borderColor: "black", borderRadius: 20, marginBottom: 30,}}><Text style={{fontWeight: 'bold',}}>Información empleados</Text></TouchableOpacity>
    <Text style={{fontSize: 20, fontWeight: 'bold', color:"black", marginTop: 50, textAlign:"center",}}>codigo de local: {Codigo}</Text>
    </View>
      </View>
  )
}

function InfoResto() {
  const [currentRestoName, setCurrentRestoName] = useState('');
  const [currentItemPrice, setCurrentItemPrice] = useState('');
  const route = useRoute();
  const Codigo = route.params.Codigo
  const navigation = useNavigation();

  useEffect(() => {
    const database = getDatabase();
    const infoRef = sRef(database, `${Codigo}/info`);
    const categoryRef = sRef(database, `${Codigo}`);
    onValue(infoRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
      const firstItem =  Object.values(data)[0].toString();
      setCurrentItemPrice(firstItem)
      }
    });
    get(categoryRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const categoryData = snapshot.val();
        setCurrentRestoName(categoryData.localName)
      } else {
        setMensaje('El local no existe o nombre incorrecto');
      }
    })
  }, []);

  const actualizarInfo = () => {
    const database = getDatabase();
    const infoRef = sRef(database, `${Codigo}/info`);

    const updatedData = {
      mesas: parseFloat(currentItemPrice),
    };

    update(infoRef, updatedData)
      .then(() => {
        setCurrentItemPrice(updatedData.mesas.toString());
      })
      .catch((error) => {
        console.error('Error updating data in Firebase: ', error);
      });
  };

  return (
<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View>
    <Text style={{alignItems: "center", justifyContent: 'center', textAlign: "center", marginTop: 40, fontSize: 30, fontWeight: 'bold', color:"#00469B",}}>Info del Restó</Text>
    <View style={{alignItems: "center", justifyContent: 'center', height:"75%"}}>
      <Text style={{fontSize: 30,}}>Nombre del Restaurante:</Text>
      <TextInput
        placeholder="Nombre"
        value={currentRestoName}
        onChangeText={(text) => setCurrentRestoName(text)}
        editable={false}
        style={{fontSize: 26, borderColor: "grey", borderWidth: 1, width:"75%", textAlign: "center", borderRadius: 20,}}
      />
      <Text style={{fontSize: 30, marginTop: 40,}}>Cantidad de mesas:</Text>
      <TextInput
        placeholder="mesas"
        value={currentItemPrice}
        onChangeText={(text) => setCurrentItemPrice(text)}
        keyboardType="numbers-and-punctuation"
        style={{fontSize: 26, borderColor: "grey", borderWidth: 1, width:"50%", textAlign: "center", borderRadius: 20,}}
      />
      <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', width: 200, height: 60, backgroundColor: '#6CCCFC', borderWidth: 1, borderColor: "black", borderRadius: 20, marginBottom: 30, marginTop: 40,}} onPress={actualizarInfo}>
        <Text>Actualizar</Text>
      </TouchableOpacity>
    </View>
    </View>
    </TouchableWithoutFeedback>
  );
}

function CrearMenu() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{flex: 1,backgroundColor: "white",}}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <TouchableOpacity onPress={() => navigation.navigate("Comida")} style={styles.button}>
            <Text style={styles.buttonText}>Comida</Text>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={() => navigation.navigate("Bebida")} style={styles.button}>
            <Text style={styles.buttonText}>Bebida</Text>
        </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

  function CrearMenuComida() {
    const navigation = useNavigation();
    const [categorias, setCategorias] = useState([]);
    const [nuevaCategoria, setNuevaCategoria] = useState('');
    const route = useRoute();
    const Codigo = route.params.Codigo
    const categoriaref = sRef(database, `${Codigo}/Comida`);

useEffect(() => {
  const unsubscribe = onValue(categoriaref, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const categoriass = Object.keys(data);
      setCategorias(categoriass);
    } else {
      setCategorias([]);
    }
  });
}, []);
  
    const crearCategoria = () => {
      const pruebaref = sRef(database, `${Codigo}/Comida/${nuevaCategoria}`);
      push(pruebaref, "")
      setNuevaCategoria('');
    };
  
    const eliminarCategoria = (categoria) => {
    const elimcategoria = sRef(database, `${Codigo}/Comida/${categoria}`);
    remove(elimcategoria);
    };
  
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ backgroundColor: 'white', height:"100%" }}>
        <View style={styles.botones}>
          <Text style={{fontSize: 40, fontWeight: 'bold', paddingBottom: 30,}}>Crear Categorias</Text>
          <TextInput
            placeholder="Nueva Categoría"
            value={nuevaCategoria}
            onChangeText={(text) => setNuevaCategoria(text)}
            style={{width: '80%', borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 0, textAlign:"center",}}
          />
          <TouchableOpacity onPress={crearCategoria} style={{justifyContent: 'center', alignItems: 'center', width: 200, height: 60, backgroundColor: '#6CCCFC', borderWidth: 1, borderColor: "black", borderRadius: 20, marginBottom: 30, marginTop: 40,}}><Text>Crear Categoría</Text></TouchableOpacity>
          <ScrollView style={{ height:"100%" }}>
          {categorias.map((categoria) => (
            
            <View key={categoria} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={styles.boton}
                onPress={() => navigation.navigate('Food', { Categoria: categoria, Ess: "Comida"  })}
              >
                <Text style={styles.botontext}>{categoria}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => eliminarCategoria(categoria)}>
                <Image
                source={require('../assets/images/tacho.png')}
                style={{ height: 40, width: 40,}}
                />
              </TouchableOpacity>
            </View>
          ))}
          </ScrollView>
        </View>
      </View>
      </TouchableWithoutFeedback>
    );
  }

  function CrearMenuBebida() {
    const navigation = useNavigation();
    const [categorias, setCategorias] = useState([]);
    const [nuevaCategoria, setNuevaCategoria] = useState('');
    const route = useRoute();
    const Codigo = route.params.Codigo
    const categoriaref = sRef(database, `${Codigo}/Bebida`);

useEffect(() => {
  const unsubscribe = onValue(categoriaref, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const categoriass = Object.keys(data);
      setCategorias(categoriass);
    } else {
      setCategorias([]);
    }
  });
}, []);
  
    const crearCategoria = () => {
      const pruebaref = sRef(database, `${Codigo}/Bebida/${nuevaCategoria}`);
      push(pruebaref, "")
      setNuevaCategoria('');
    };
  
    const eliminarCategoria = (categoria) => {
    const elimcategoria = sRef(database, `${Codigo}/Bebida/${categoria}`);
    remove(elimcategoria);
    };
  
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ backgroundColor: 'white', height:"100%" }}>
        <View style={styles.botones}>
          <Text style={{fontSize: 40, fontWeight: 'bold', paddingBottom: 30,}}>Crear Categorias</Text>
          <TextInput
            placeholder="Nueva Categoría"
            value={nuevaCategoria}
            onChangeText={(text) => setNuevaCategoria(text)}
            style={{width: '80%', borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 0, textAlign:"center",}}
          />
          <TouchableOpacity onPress={crearCategoria} style={{justifyContent: 'center', alignItems: 'center', width: 200, height: 60, backgroundColor: '#6CCCFC', borderWidth: 1, borderColor: "black", borderRadius: 20, marginBottom: 30, marginTop: 40,}}><Text>Crear Categoría</Text></TouchableOpacity>
          <ScrollView style={{ height:"100%" }}>
          {categorias.map((categoria) => (
            
            <View key={categoria} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={styles.boton}
                onPress={() => navigation.navigate('Food', { Categoria: categoria, Ess: "Bebida" })}
              >
                <Text style={styles.botontext}>{categoria}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => eliminarCategoria(categoria)}>
                <Image
                source={require('../assets/images/tacho.png')}
                style={{ height: 40, width: 40,}}
                />
              </TouchableOpacity>
            </View>
          ))}
          </ScrollView>
        </View>
      </View>
      </TouchableWithoutFeedback>
    );
  }


    function Subcategoria({ route }) {
      const { Categoria, Ess } = route.params;
      const [menu, setMenu] = useState([]);
      const [itemName, setItemName] = useState('');
      const [itemPrice, setItemPrice] = useState('');
      const [opcionName, setOpcionName] = useState('');
      const [opciones, setOpciones] = useState([]);
      const [isEditing, setIsEditing] = useState(false);
      const [selectedItemId, setSelectedItemId] = useState(null);
      const Codigo = route.params.Codigo
      const navigation = useNavigation();
      useEffect(() => {
        const menuRef = sRef(database, `${Codigo}/${Ess}/${Categoria}`);
    
        const unsubscribe = onValue(menuRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const menuItems = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setMenu(menuItems);
          } else {
            setMenu([]);
          }
        });
    
        return () => {
          off(menuRef, 'value', unsubscribe);
        };
      }, []);
    
      const agregarOpcion = () => {
        const nuevaOpcion = {
          nombre: opcionName,
        };
        setOpciones([...opciones, nuevaOpcion]);
        setOpcionName('');
      };
    
      const agregarItemAlMenu = () => {
        const menuRef = sRef(database, `${Codigo}/${Ess}/${Categoria}`);
    
        let newItem;

        if (opciones) {
        newItem = {
        nombre: itemName,
        precio: itemPrice,
        opciones: opciones,
        Es: Ess,
        };
        } else {
        newItem = {
        nombre: itemName,
        precio: itemPrice,
        Es: Ess,
        };
        }
    
        push(menuRef, newItem);
    
        setItemName('');
        setItemPrice('');
        setOpciones([]);
      };
    
      const editarItemEnMenu = () => {
        const menuRef = sRef(database, `${Codigo}/${Ess}/${Categoria}`);
    
      let updatedItem;

        if (opciones) {
        updatedItem = {
        nombre: itemName,
        precio: itemPrice,
        opciones: opciones,
        Es: Ess,
        };
        } else {
        updatedItem = {
        nombre: itemName,
        precio: itemPrice,
        Es: Ess,
        };
        }
    
        const updates = {};
        updates[selectedItemId] = updatedItem;
    
        update(menuRef, updates)
          .then(() => {
            setItemName('');
            setItemPrice('');
            setOpciones([]);
            setIsEditing(false);
            setSelectedItemId(null);
          })
          .catch((error) => {
            console.error('Error updating data: ', error);
          });
      };
    
      const eliminarItemDelMenu = (itemId) => {
        const menuRef = sRef(database, `${Codigo}/${Ess}/${Categoria}`);
    
        const updates = {};
        updates[itemId] = null;
    
        update(menuRef, updates)
          .then(() => {
            // Eliminación exitosa
          })
          .catch((error) => {
            console.error('Error removing data: ', error);
          });
      };
    
      const handleEditItem = (item) => {
        setIsEditing(true);
        setSelectedItemId(item.id);
        setItemName(item.nombre);
        setItemPrice(item.precio.toString());
        setOpciones(item.opciones);
      };
    
      return (
        <View style={{backgroundColor: 'white', flex: 1,}}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ paddingTop: 50, backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={styles.title}>{Categoria}</Text>
          <TextInput
            placeholder="Nombre del artículo"
            value={itemName}
            onChangeText={(text) => setItemName(text)}
            style={{width: '80%' , borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, textAlign:"center",}}
          />
          <TextInput
              placeholder="Precio"
              value={itemPrice}
              onChangeText={(text) => setItemPrice(text)}
              keyboardType="numbers-and-punctuation"
              style={{width: '80%', borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, textAlign:"center",}}
          />
          <TextInput
            placeholder="Nombre de la variante (opcional)"
            value={opcionName}
            onChangeText={(text) => setOpcionName(text)}
            style={{width: '80%' , borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, textAlign:"center",}}
          />
          <TouchableOpacity onPress={agregarOpcion}  style={{justifyContent: 'center', alignItems: 'center', width: 140, height: 40, backgroundColor: '#CCE3FF', borderWidth: 1, borderColor: "black", borderRadius: 20, marginBottom: 30, marginTop: 10,}}><Text>Agregar variante</Text></TouchableOpacity>
          {isEditing ? (
            <TouchableOpacity onPress={editarItemEnMenu}  style={{justifyContent: 'center', alignItems: 'center', width: 150, height: 50, backgroundColor: '#6CCCFC', borderWidth: 1, borderColor: "black", borderRadius: 20, marginBottom: 30, marginTop: 10,}}><Text>Editar Producto</Text></TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={agregarItemAlMenu}  style={{justifyContent: 'center', alignItems: 'center', width: 150, height: 50, backgroundColor: '#6CCCFC', borderWidth: 1, borderColor: "black", borderRadius: 20, marginBottom: 30, marginTop: 10,}}><Text>Agregar al menú</Text></TouchableOpacity>
          )}
          </View>
          </TouchableWithoutFeedback>
          <FlatList
          data={menu}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            item.nombre || item.precio ? (
            <View style={{padding: 10, borderColor: 'black', borderWidth: 1, margin: 10, alignItems:"center"}}>
            <Text key={"nombre"} style={{fontSize: 16,fontWeight: 'bold',}}>Nombre:</Text>
            <Text key={"nombre2"}>{item.nombre}</Text>
            <Text key={"precio"} style={{fontSize: 16,fontWeight: 'bold',}}>Precio:</Text>
            <Text key={"precio2"}>${item.precio}</Text>
            <Text key={"variantes"} style={{fontSize: 16,fontWeight: 'bold',}}>Variantes:</Text>
              {item.opciones ? (
              item.opciones.map((opcion, index) => (
                <>
            <Text key={index}>{opcion.nombre}</Text>
            </>
            ))
            ) : <Text key={"no"}>No tiene</Text>}
      <TouchableOpacity onPress={() => handleEditItem(item)} key={"editar"}><Text style={{fontSize: 16, fontWeight: 'bold', color:"#00469B"}} key={"editar2"}>Editar</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => eliminarItemDelMenu(item.id)} key={"eliminar"}><Text style={{fontSize: 16, fontWeight: 'bold', color:"red"}} key={"eliminar2"}>Eliminar</Text></TouchableOpacity>
    </View>
    ) : null
  )}
/>
        </View>
      );
    }

        function RegistroEmpleado() {
          const [empleados, setEmpleados] = useState([]);
          const [EmpleadoName, setEmpleadoName] = useState('');
          const [EmpleadoContraseña, setEmpleadoContraseña] = useState('');
          const [isEditing, setIsEditing] = useState(false);
          const [selectedItemId, setSelectedItemId] = useState(null);
          const [EmpleadoPuesto, setEmpleadoPuesto] = useState({
            Mozo: false,
            Cocinero: false,
            Barra: false,
            Caja: false,
          });
          const route = useRoute();
          const Codigo = route.params.Codigo
        
          useEffect(() => {
            const empleadosRef = sRef(database, `${Codigo}/Empleados`);
        
            const unsubscribe = onValue(empleadosRef, (snapshot) => {
              if (snapshot.exists()) {
                const data = snapshot.val();
                const empleadosItem = Object.keys(data).map((key) => ({
                  id: key,
                  ...data[key],
                }));
                setEmpleados(empleadosItem);
              } else {
                setEmpleados([]);
              }
            });
        
            return () => {
              off(empleadosRef, 'value', unsubscribe);
            };
          }, []);
        
          const agregarEmpleado = () => {
            const empleadosRef = sRef(database, `${Codigo}/Empleados`);
        
            const newItem = {
            nombre: EmpleadoName,
            contrasena: EmpleadoContraseña,
            puesto: Object.keys(EmpleadoPuesto).find(key => EmpleadoPuesto[key]),
            }
        
            push(empleadosRef, newItem);
        
            setEmpleadoName('');
            setEmpleadoContraseña('');
            setEmpleadoPuesto("")
          };
        
          const editarItemEnMenu = () => {
            const empleadosRef = sRef(database, `${Codigo}/Empleados`);
        
          const updatedItem = {
            nombre: EmpleadoName,
            contrasena: EmpleadoContraseña,
            puesto: Object.keys(EmpleadoPuesto).find(key => EmpleadoPuesto[key]),
            }
        
            const updates = {};
            updates[selectedItemId] = updatedItem;
        
            update(empleadosRef, updates)
              .then(() => {
                setEmpleadoName('');
                setEmpleadoContraseña('');
                setEmpleadoPuesto("")
                setIsEditing(false);
                setSelectedItemId(null);
              })
              .catch((error) => {
                console.error('Error updating data: ', error);
              });
          };
        
          const eliminarItemDelMenu = (itemId) => {
            const empleadosRef = sRef(database, `${Codigo}/Empleados`);
        
            const updates = {};
            updates[itemId] = null;
        
            update(empleadosRef, updates)
              .then(() => {
                // Eliminación exitosa
              })
              .catch((error) => {
                console.error('Error removing data: ', error);
              });
          };
        
          const handleEditEmpleado = (item) => {
            setIsEditing(true);
            setSelectedItemId(item.id);
            setEmpleadoName(item.nombre);
            setEmpleadoContraseña(item.contrasena);
            setEmpleadoPuesto(item.puesto)
          };

          
        
          return (
            <View style={{backgroundColor: 'white', flex: 1,}}>
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={{ paddingTop: 50, backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={styles.title}>Administrar empleados</Text>
              <TextInput
                placeholder="Nombre del empleado"
                value={EmpleadoName}
                onChangeText={(text) => setEmpleadoName(text)}
                style={{width: '80%', borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, textAlign:"center",}}
              />
              <TextInput
                  placeholder="contraseña"
                  value={EmpleadoContraseña}
                  onChangeText={(text) => setEmpleadoContraseña(text)}
                  style={{width: '80%', borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, textAlign:"center",}}
              />

        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10, marginBottom: 30 }}>
        <CheckBox
        style={{ marginRight: 10,}}
          value={EmpleadoPuesto.Mozo}
          onValueChange={(value) => setEmpleadoPuesto({ Mozo: value, Cocinero: false, Barra: false, Caja: false })}
        />
        <Text style={{fontWeight: 'bold',}}>Mozo</Text>

        <CheckBox
        style={{ marginRight: 10, marginLeft: 10, }}
          value={EmpleadoPuesto.Cocinero}
          onValueChange={(value) => setEmpleadoPuesto({ Mozo: false, Cocinero: value, Barra: false, Caja: false })}
        />
        <Text style={{fontWeight: 'bold',}}>Cocinero</Text>

        <CheckBox
        style={{ marginRight: 10, marginLeft: 10, }}
          value={EmpleadoPuesto.Barra}
          onValueChange={(value) => setEmpleadoPuesto({ Mozo: false, Cocinero: false, Barra: value, Caja: false })}
        />
        <Text style={{fontWeight: 'bold',}}>Barra</Text>

        <CheckBox
        style={{ marginRight: 10, marginLeft: 10, }}
          value={EmpleadoPuesto.Caja}
          onValueChange={(value) => setEmpleadoPuesto({ Mozo: false, Cocinero: false, Barra: false, Caja: value })}
        />
        <Text style={{fontWeight: 'bold',}}>Caja</Text>
      </View>
              {isEditing ? (
                <TouchableOpacity onPress={editarItemEnMenu}  style={{justifyContent: 'center', alignItems: 'center', width: 150, height: 50, backgroundColor: '#6CCCFC', borderWidth: 1, borderColor: "black", borderRadius: 20, marginBottom: 30,}}><Text>Editar Empleado</Text></TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={agregarEmpleado}  style={{justifyContent: 'center', alignItems: 'center', width: 150, height: 50, backgroundColor: '#6CCCFC', borderWidth: 1, borderColor: "black", borderRadius: 20, marginBottom: 30,}}><Text>Agregar Empleado</Text></TouchableOpacity>
              )}
              </View>
              </TouchableWithoutFeedback>
              <FlatList
              data={empleados}
              keyExtractor={(item) => item.id}
              style={{width: '100%', flex: 1,}}
              renderItem={({ item }) => (
                <View style={{padding: 10, borderColor: 'black', borderWidth: 1, margin: 10, alignItems:"center", width: '95%',}}>
                <Text key={"nombre"} style={{fontSize: 16,fontWeight: 'bold',}}>Nombre:</Text>
                <Text key={"nombre2"}>{item.nombre}</Text>
                <Text key={"contraseña"} style={{fontSize: 16,fontWeight: 'bold',}}>Contraseña</Text>
                <Text key={"contraseña2"}>{item.contrasena}</Text>
                <Text key={"puesto"} style={{fontSize: 16,fontWeight: 'bold',}}>Puesto</Text>
                <Text key={"puesto2"}>{item.puesto}</Text>
          <TouchableOpacity onPress={() => handleEditEmpleado(item)} key={"editar"}><Text style={{fontSize: 16, fontWeight: 'bold', color:"#00469B"}} key={"editar2"}>Editar</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => eliminarItemDelMenu(item.id)} key={"eliminar"}><Text style={{fontSize: 16, fontWeight: 'bold', color:"red"}} key={"eliminar2"}>Eliminar</Text></TouchableOpacity>
        </View>
      )}
    />
            </View>
          );
        }

        function MozoCierres() {
          const [mozos, setMozos] = useState([]);
          const [mesascerradas, setMesascerradas] = useState([]);
          const route = useRoute();
          const Codigo = route.params.Codigo
        
          useEffect(() => {
            const databaseRef = sRef(getDatabase(), `${Codigo}/Empleados`);
        
            const unsubscribe = onValue(databaseRef, (snapshot) => {
              const data = snapshot.val();
              if (data) {
                const mozosFiltrados = Object.values(data).filter((empleado) => empleado.puesto === 'Mozo');
                const mozoPromises = mozosFiltrados.map(async (empleado) => {
                  const cierresSnapshot = sRef(getDatabase(), `${Codigo}/Infomozos/` + `Mesascerradas${empleado.nombre}`);
                  const unsubscribe = onValue(cierresSnapshot, (snapshot) => {
                    if (snapshot.exists()) {
                      // Actualiza los estados de mozos y mesas cerradas
                      setMozos((prevMozos) => [...prevMozos, empleado.nombre]);
                      setMesascerradas((prevMesascerradas) => [...prevMesascerradas, snapshot.val()]);
                    } else {
                      setMesascerradas((prevMesascerradas) => [...prevMesascerradas, {}]);
                    }
                  });
                });
              }
            });
          }, []);

          const reiniciarcontador = () =>  {
            const closetables = sRef(getDatabase(), `${Codigo}/Mesascerradas`);
            setMozos("")
            setMesascerradas("")
            remove(closetables)
          }
        
          return (

            <View style={{alignItems:"center",}}>
              <Text style={{fontSize: 25, paddingBottom: 30, paddingTop: 30 , color:"#00469B"}}>Cierres de Mesas por Mozo</Text>
              <ScrollView style={{height:"70%"}}>
              {mozos ? (
              mozos.map((mozo, index) => (
                <View key={index} style={styles.mozoItem}>
                  <Text>Mozo: {mozo}</Text>
                  <Text>Mesas Cerradas: {mesascerradas[index]}</Text>
                </View>
              ))
            ) : null}
              </ScrollView>
              <TouchableOpacity onPress={reiniciarcontador} style={{justifyContent: 'center', alignItems: 'center', width: 200, height: 50, backgroundColor: '#6CCCFC', borderWidth: 1, borderColor: "black", borderRadius: 20, marginBottom: 30, marginTop: 10,}}><Text>Reiniciar contadores</Text></TouchableOpacity>
            </View>
          );
        }



    const styles = StyleSheet.create({
        container: {
            paddingTop: 50,
            backgroundColor: 'white',
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
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
        input: {
            width: '80%',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textAlign:"center",
        },
        logo: {
            marginBottom: 40,
        },
        item: {
            marginBottom: 8,
        },
        botones: {
            marginTop: 50,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
        },
        boton: {
            justifyContent: 'center',
            alignItems: 'center',
            width: 350, 
            height: 60,
            backgroundColor: '#6CCCFC',
            borderWidth: 1,
            borderColor: "black",
            borderRadius: 20,
            marginBottom: 4,
        },
        botontext: {
            color: 'white',
        },
        title: {
            fontSize: 30,
            paddingBottom: 30,
            
        },
        crear: {
            marginTop: 20,
            marginBottom: 50,
            backgroundColor: '#6CCCFC',
            height: 50,
            width: 150,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        mozoItem: {
          padding: 10,
          borderColor: 'black',
          borderWidth: 1,
          margin: 10,
        },
    });