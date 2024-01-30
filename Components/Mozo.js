import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, TouchableHighlight, FlatList, } from 'react-native';
import { getDatabase, onValue, off, push, get, set, remove, update } from "firebase/database";
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FirebaseApp, initializeApp } from "firebase/app";
import { ref as sRef} from "firebase/database";
import CheckBox from 'expo-checkbox';
import { Modal, Portal, Button as PaperButton } from 'react-native-paper';



export default function App() {
  const route = useRoute();
  const { nombre, codigo } = route.params;

    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator>
                <Stack.Screen
                name="TableS"
                component={MozoPage}
                options={{ headerShown: false }}
                initialParams={{ nombre: nombre, Codigo: codigo}}
                />
                <Stack.Screen
                name="elegirmenu"
                component={ElegirMenu}
                options={{ headerShown: false }}
                initialParams={{ Codigo: codigo }}
                />
                <Stack.Screen
                name="subcategoria"
                component={Subcategoria}
                options={{ headerShown: false }}
                initialParams={{ Codigo: codigo }}
                />
        </Stack.Navigator>
        </NavigationContainer>
    );
}

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


function MozoPage() {
  const [mesas, setMesas] = useState([]); // Aquí guardaremos el número de mesas
  const [cantidadmesas, setCantidadMesas] = useState(null); // Declarar cantidadmesas
  const navigation = useNavigation();
  const route = useRoute();
  const nombre = route.params.nombre
  const Codigo = route.params.Codigo
  const infoRef = sRef(database, `${Codigo}/info`);
  
  useEffect(() => {
    const unsubscribe = onValue(infoRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const infoItems = Object.values(data);
        const cantidadmesas = infoItems[0]
  
        setMesas(new Array(cantidadmesas).fill(null));
        setCantidadMesas(cantidadmesas);
      } else {
        setMesas([]);
      }
    }, []); // Aquí, pasamos un array de dependencias vacío
  }, []);

  const handleMesaPress = (mesaNumber) => {
    // Navegar a la página deseada y pasar el número de mesa como parámetro
    navigation.navigate('elegirmenu', { mesaNumber, nombre });
  };

  return (
    <>
    <View style={styles.container}>
      <Text style={styles.title}>Seleccione una mesa:</Text>
      </View>
    <ScrollView contentContainerStyle={styles.mesas}>
      {cantidadmesas !== null && (
        mesas.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => handleMesaPress(index + 1)} style={styles.botontable}>
            <Text>Mesa {index + 1}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
    </>
  );
}





function ElegirMenu() {
  const route = useRoute(); // Obtén el objeto de ruta
  const nombre = route.params.nombre
  const Codigo = route.params.Codigo
  const menu = sRef(database);
  const navigation = useNavigation();
  const [subcategorias, setSubcategorias] = useState([]);

   const [elementosNoEnviados, setElementosNoEnviados] = useState([]);
  const [elementosEnviados, setElementosEnviados] = useState([]);

  useEffect(() => {
    onValue(carrito, (snapshot) => {
      if (snapshot.exists()) {
        const pedido = snapshot.val();
        const elementos = Object.values(pedido);

        // Separa los elementos en "enviados" y "no enviados"
        const elementosNoEnviados = elementos.filter((elemento) => !elemento.enviado);
        const elementosEnviados = elementos.filter((elemento) => elemento.enviado);

        setElementosNoEnviados(elementosNoEnviados);
        setElementosEnviados(elementosEnviados);
      } else {
        setElementosNoEnviados([]);
        setElementosEnviados([]);
      }
    });
  }, []);

  useEffect(() => {
    // Referencia a la categoría "Comida"
    const comidaRef = sRef(getDatabase(), `${Codigo}/Comida`);
    // Referencia a la categoría "Bebida"
    const BebidaRef = sRef(getDatabase(), `${Codigo}/Bebida`);
  
    const unsubscribeComida = onValue(comidaRef, (snapshotComida) => {
      const comidaData = snapshotComida.exists() ? snapshotComida.val() : {};
      const comidaSubcategorias = Object.keys(comidaData);
      
      const unsubscribeBebida = onValue(BebidaRef, (snapshotBebida) => {
        const bebidaData = snapshotBebida.exists() ? snapshotBebida.val() : {};
        const bebidaSubcategorias = Object.keys(bebidaData);
  
        // Fusiona las subcategorías de "Comida" y "Bebida" en un solo array
        const subcategoriasArray = [...comidaSubcategorias, ...bebidaSubcategorias];
        setSubcategorias(subcategoriasArray);
      });
  
      // Retorna la función de limpieza para el efecto de "Bebida"
      return () => {
        off(BebidaRef, 'value', unsubscribeBebida);
      };
    });
  
    // Retorna la función de limpieza para el efecto de "Comida"
    return () => {
      off(comidaRef, 'value', unsubscribeComida);
    };
  }, [Codigo]);
  

  const { mesaNumber } = route.params; // Extrae el número de mesa de los parámetros

  const nombreCategoriaCarrito = `${Codigo}/Carritos/` + `CarritoMesa${mesaNumber}`;
  const carrito = sRef(database, nombreCategoriaCarrito);

  const [altura, setAltura] = useState('10%');
  const [display, setDisplay] = useState('none');
  const [flecha, setFlecha] = useState('▲');
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
  onValue(carrito, (snapshot) => {
    if (snapshot.exists()) {
      const pedido = snapshot.val();
      setPedido(pedido);
    } else {

      setPedido(null);
    }
  });
}, []);



const agruparElementosPorNombreYVariante = (elementos) => {
  const agrupados = {};

  elementos.forEach((elemento) => {
    const key = `${elemento.nombre} - ${elemento.variante || ''}`;
    if (agrupados[key]) {
      agrupados[key].cantidad++;
    } else {
      agrupados[key] = { ...elemento, cantidad: 1 };
    }
  });

  return Object.values(agrupados);
};

const EnviarAlChef = async (tipoPedido) => {
  const nombreCategoriaCarrito = `${Codigo}/Carritos/` + `CarritoMesa${mesaNumber}`;
  const carrito = sRef(database, nombreCategoriaCarrito);

  try {
    const snapshot = await get(carrito);

    if (snapshot.exists()) {
      const carritoPendiente = snapshot.val();

      // Verifica si el carrito pendiente es un array
      if (Array.isArray(carritoPendiente)) {
        // Filtra los elementos pendientes
        const elementosPendientes = carritoPendiente.filter((elemento) => !elemento.enviado);

        if (elementosPendientes.length > 0) {
          // Itera sobre los elementos pendientes y envía cada elemento al chef
          for (const elemento of elementosPendientes) {
            if (elemento.Es === "Comida") {
              await EnviarElementoAlChef(elemento, tipoPedido);
            } else {
              await EnviarElementoABarra(elemento, tipoPedido);
            }
          }

          // Marca los elementos como enviados en el carrito pendiente
          const carritoActualizado = carritoPendiente.map((item) => ({
            ...item,
            enviado: true,
          }));

          // Actualiza el carrito en la base de datos con los elementos enviados
          await set(carrito, carritoActualizado);
        } else {
          // No hay elementos pendientes para enviar
        }
      } else {
        console.error('El carrito pendiente no es un array válido.');
      }
    } else {
      // El carrito no existe
    }
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
  }
};

const EnviarElementoAlChef = async (elemento, tipoPedido) => {
  const chefRef = sRef(getDatabase(), `${Codigo}/comandas/${Object.keys(tipoPedido).find(key => tipoPedido[key])}mesa${mesaNumber}`);
  const ElementRef = sRef(getDatabase(), `${Codigo}/comandas/${Object.keys(tipoPedido).find(key => tipoPedido[key])}mesa${mesaNumber}/elementos`);
  const mesa = mesaNumber;
  const estado = "Para preparar";
  const tipo = Object.keys(tipoPedido).find(key => tipoPedido[key]);
  const fecha = new Date();

  try {
    const pedidoAlChef = {
      elemento: elemento.variante
        ? `${elemento.nombre} - ${elemento.variante}`
        : elemento.nombre,
      precio: elemento.precio,
    };

    update(chefRef, { mesa, estado, tipo, fecha});
    await push(ElementRef, pedidoAlChef);

  } catch (error) {
    console.error('Error al enviar el elemento al chef:', error);
  }
};

const EnviarElementoABarra = async (elemento) => {
  const chefRef = sRef(getDatabase(), `${Codigo}/comandasBarra/${Object.keys(tipoPedido).find(key => tipoPedido[key])}mesa${mesaNumber}`);
  const ElementRef = sRef(getDatabase(), `${Codigo}/comandasBarra/${Object.keys(tipoPedido).find(key => tipoPedido[key])}mesa${mesaNumber}/elementos`);
  const mesa = mesaNumber;
  const estado = "Para preparar";
  const tipo = Object.keys(tipoPedido).find(key => tipoPedido[key]);
  const fecha = new Date();

  try {
    const pedidoAlChef = {
      elemento: elemento.variante
        ? `${elemento.nombre} - ${elemento.variante}`
        : elemento.nombre,
      precio: elemento.precio,
    };

    update(chefRef, { mesa, estado, tipo, fecha});
    await push(ElementRef, pedidoAlChef);

  } catch (error) {
    console.error('Error al enviar el elemento a barra:', error);
  }
};

const cerrarMesa = async () => {

  const carritoSnapshot = await get(carrito);
  if (carritoSnapshot.exists()) {
    const carritoData = carritoSnapshot.val();
  try {
    await remove(carrito);
  } catch (error) {
    console.error('Error al cerrar el carrito:', error);
  }

  const mesascerradasRef = sRef(database, `${Codigo}/Mesascerradas/` + `Mesa${mesaNumber}cerrada`)
  const mesacerrada = {
    mozo: nombre,
    mesa: mesaNumber,
    carrito: carritoData,
  }

  push(mesascerradasRef, mesacerrada)

  // Incrementa el contador de mesas cerradas
  const contadorRef = sRef(database, `${Codigo}/Infomozos/` + `Mesascerradas${nombre}`);
  try {
    const contadorSnapshot = await get(contadorRef);
    const contadorActual = contadorSnapshot.val() || 0;
    await set(contadorRef, contadorActual + 1);
  } catch (error) {
    console.error('Error al actualizar el contador de mesas cerradas:', error);
  }
}
else {

}}

const handleEliminarElemento = (elementoId) => {
  // Eliminar el elemento del carrito
  const carritoActualizado = [...elementosNoEnviados, ...elementosEnviados].filter((elemento) => elemento.id !== elementoId);
  set(carrito, carritoActualizado)
    .then(() => {
      // Lógica adicional después de eliminar el elemento
    })
    .catch((error) => {
      console.error('Error al eliminar el elemento del carrito:', error);
    });
};



  function desplegar() {
    if (altura < '20%') {
    setAltura('60%');
    setDisplay("flex")
    setFlecha("▼")
  }
  else {
    setAltura('10%');
    setDisplay("none")
    setFlecha("▲")

  }
  }

  const [tipoPedido, setTipoPedido] = useState({
    Entrada: false,
    Platos: false,
    Postre: false,
  });

  return (
    <View style={{backgroundColor:"white", height:"100%"}}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#6CCCFC',  width: 95, marginTop: 0,}}>
        <Text style={{color: 'black', fontSize: 16,}}>Volver</Text>
      </TouchableOpacity>
    <View style={styles.container}>
    <Text style={styles.title}>Pedido de la mesa {mesaNumber}</Text>
    <Text>Menu:</Text>
      </View>
      <ScrollView contentContainerStyle={styles.mesas}>
      {subcategorias.map((subcategoria, index) => (
        <TouchableOpacity
          key={index}
          style={styles.boton}
          onPress={() => {
            // Navegar a la pantalla de la subcategoría seleccionada
            navigation.navigate('subcategoria', { subcategoria, mesaNumber, nombre,});
          } }
        >
          <Text style={styles.botontext}>{subcategoria}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
    <View style={{height: altura, backgroundColor: '#6CADFC', alignContent: 'center', }}>
    <Text id='desplegame' style={styles.title} onPress={() => desplegar()}>{flecha} Orden de la mesa {flecha}</Text>
    <View style={{display: display,}}>
    <Text style={{textAlign:"center", fontSize: 24,fontWeight: 'bold', marginBottom: 20,}}>{pedido ? 'Pedido:': 'El pedido está vacío'}</Text>
    <ScrollView style={{ height: '30%' }}>
          {agruparElementosPorNombreYVariante(elementosEnviados).map((item, index) => (
            <Text
              style={{ textAlign: 'center', backgroundColor: '#6CFC7B' }}
              key={index}
            >
              {item.nombre}{item.variante ? ` - ${item.variante}` : ''} X{item.cantidad}
            </Text>
          ))}
          {agruparElementosPorNombreYVariante(elementosNoEnviados).map((item, index) => (
            <Text
              style={{ textAlign: 'center', backgroundColor: '#FC6C6C' }}
              key={index}
            >
              {item.nombre}{item.variante ? ` - ${item.variante}` : ''} X{item.cantidad}
          <TouchableOpacity onPress={() => handleEliminarElemento(item.id)}>
            <Text style={{ textAlign: 'center', backgroundColor: '#FF0000', color: 'white', padding: 5, marginLeft: 10 }}>
              Eliminar
            </Text>
          </TouchableOpacity>
            </Text>
          ))}
        </ScrollView>
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10 }}>
        <CheckBox
          value={tipoPedido.Entrada}
          onValueChange={(value) => setTipoPedido({ Entrada: value, Platos: false, Postre: false })}
        />
        <Text>Entrada</Text>

        <CheckBox
          value={tipoPedido.Platos}
          onValueChange={(value) => setTipoPedido({ Entrada: false, Platos: value, Postre: false })}
        />
        <Text>Platos</Text>

        <CheckBox
          value={tipoPedido.Postre}
          onValueChange={(value) => setTipoPedido({ Entrada: false, Platos: false, Postre: value })}
        />
        <Text>Postre</Text>
      </View>
    <View style={{alignItems:"center",}}>
    <TouchableOpacity onPress={() => EnviarAlChef(tipoPedido)} style={{backgroundColor: 'white', width:"30%", height:"20%", justifyContent:"center", marginTop:"5%"}}><Text style={{textAlign:"center",}}>Enviar</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => cerrarMesa(nombre, mesaNumber)} style={{backgroundColor: 'white', width:"30%", height:"22%", justifyContent:"center", marginTop:"5%"}}><Text style={{textAlign:"center",}}>Cerrar la mesa</Text></TouchableOpacity>
    </View>
    </View>
    </View>
    </View>
  );
}




function Subcategoria() {
  const [menuItems, setMenuItems] = useState([]);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const route = useRoute();
  const subcategoria = route.params.subcategoria
  const mesaNumber = route.params.mesaNumber
  const Codigo = route.params.Codigo
  const navigation = useNavigation();



  useEffect(() => {
    // Referencia a la subcategoría de "Comida"
    const subcategoriaRefComida = sRef(getDatabase(), `${Codigo}/Comida/` + subcategoria);
    // Referencia a la subcategoría de "Bebida"
    const subcategoriaRefBebida = sRef(getDatabase(), `${Codigo}/Bebida/` + subcategoria);
  
    const unsubscribeComida = onValue(subcategoriaRefComida, (snapshotComida) => {
      if (snapshotComida.exists()) {
        const dataComida = snapshotComida.val();
        const elementosComida = Object.keys(dataComida).map((key) => ({
          id: key,
          ...dataComida[key],
        }));
        setMenuItems(elementosComida);
      } else {
        setMenuItems([]);
      }
    });
  
    const unsubscribeBebida = onValue(subcategoriaRefBebida, (snapshotBebida) => {
      if (snapshotBebida.exists()) {
        const dataBebida = snapshotBebida.val();
        const elementosBebida = Object.keys(dataBebida).map((key) => ({
          id: key,
          ...dataBebida[key],
        }));
        // Combina los elementos de "Comida" y "Bebida"
        setMenuItems((prevItems) => [...prevItems, ...elementosBebida]);
      } else {
        // No sobrescribe los elementos de "Comida" si no hay elementos de "Bebida"
      }
    });
  
    // Retorna la función de limpieza para ambos efectos
    return () => {
      off(subcategoriaRefComida, 'value', unsubscribeComida);
      off(subcategoriaRefBebida, 'value', unsubscribeBebida);
    };
  }, [Codigo, subcategoria]);
  


  const AgregarAlCarrito = (item) => {


    if (item.opciones) {

      setSelectedItem(item);
      setShowOptionsModal(true);

    }
    else {
    const nombreCategoriaCarrito = `${Codigo}/Carritos/` + `CarritoMesa${mesaNumber}`;
    const carrito = sRef(database, nombreCategoriaCarrito);

    const newItem = {
      Es: item.Es,
      id: Date.now(),
      nombre: item.nombre,
      precio: item.precio,
    };

    get(carrito).then((snapshot) => {
      if (snapshot.exists()) {
        const carritoExistente = snapshot.val();
        let carritoArray = [];

        if (Array.isArray(carritoExistente)) {
          carritoArray = carritoExistente;
        } else if (typeof carritoExistente === 'object') {
          carritoArray = Object.values(carritoExistente);
        }

        carritoArray.push(newItem);
        set(carrito, carritoArray);
      } else {
        const nuevoCarrito = [newItem];
        set(carrito, nuevoCarrito);
      }
    });
  }
  };

  const AgregarAlCarritoConVariante = (item, opcion) => {
    const nombreCategoriaCarrito = `${Codigo}/Carritos/` + `CarritoMesa${mesaNumber}`;
    const carrito = sRef(database, nombreCategoriaCarrito);

    const newItem = {
      id: Date.now(),
      nombre: item.nombre,
      precio: item.precio,
      variante: opcion,
      Es: item.Es,
    };

    get(carrito).then((snapshot) => {
      if (snapshot.exists()) {
        const carritoExistente = snapshot.val();
        let carritoArray = [];

        if (Array.isArray(carritoExistente)) {
          carritoArray = carritoExistente;
        } else if (typeof carritoExistente === 'object') {
          carritoArray = Object.values(carritoExistente);
        }

        carritoArray.push(newItem);
        set(carrito, carritoArray);
      } else {
        const nuevoCarrito = [newItem];
        set(carrito, nuevoCarrito);
      }
    });
    setShowOptionsModal(false);
  };


  const closeModal = () => {
    setShowOptionsModal(false);
  };

  const ModalComponent = ({ visible, onClose, opciones, item }) => {
    if (!visible) return null;
  
    return (
      <Modal visible={visible} animationType="slide">
        <View style={{justifyContent: 'center', alignItems: 'center',}}>
          <View style={{ backgroundColor: 'white', padding: 10, borderColor: 'black', borderWidth: 1, }}>
            <Text style={{fontSize: 15, fontWeight: 'bold', textAlign:"center", marginBottom: 10,}}>elige una opcion:</Text>
            {opciones ? (
              opciones.map((opcion, index) => (
                <TouchableOpacity style={{backgroundColor: '#6CCCFC', justifyContent: 'center', alignItems: 'center', textAlign:"center", width: 200, height: 40, borderWidth: 1, borderColor: "black", marginBottom: 10,}} key={index} onPress={() => AgregarAlCarritoConVariante(item, opcion.nombre)}><Text>{opcion.nombre}</Text></TouchableOpacity>
              ))
            ) : null}
            <Button title="Cerrar" onPress={onClose} />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={{height:"100%", backgroundColor:"white"}}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#6CCCFC',  width: 95, marginTop: 0,}}>
        <Text style={{color: 'black', fontSize: 16,}}>Volver</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{subcategoria}</Text>
        <FlatList
          style={{height:"100%"}}
          data={menuItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            item.nombre || item.precio ? (
            <TouchableHighlight onPress={() => AgregarAlCarrito(item)} underlayColor="#6CCCFC" style={{ alignItems: "center", padding: 10, borderColor: 'black', borderWidth: 1, margin: 10 }}>
            <View >
              <Text>{item.nombre}</Text>
              <Text>Precio: ${item.precio}</Text>
              <Text style={{fontWeight: 'bold', color:"#00469B"}}>Agregar al pedido</Text>
            </View>
            </TouchableHighlight>
            ) : null
          )}
        />
    <ModalComponent visible={showOptionsModal} onClose={closeModal} opciones={selectedItem?.opciones} item={selectedItem}/>
    </View>
  );
}




const styles = {
  white: {
    backgroundColor: 'white',
  },
  container: {
    alignItems: 'center',
    marginTop: '20%',
    marginBottom: '10%',
    
  },
  mesas: {
    height: 'auto',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign:"center",
  },
  boton: {
    width: 200,
    height: 50,
    backgroundColor: '#6CCCFC',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botontable: {
    width: 100,
    height: 100,
    backgroundColor: '#6CCCFC',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botontext: {
    color: 'white',
  },
};



