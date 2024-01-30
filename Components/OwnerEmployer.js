import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity} from 'react-native';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Certificate } from 'crypto';


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
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',}}>

            <TouchableOpacity onPress={() => navigation.navigate("Owner")} style={styles.button}>
                <Text style={styles.buttonText}>Soy Dueño</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Employer")} style={styles.button}>
                <Text style={styles.buttonText}>Soy Empleado</Text>
            </TouchableOpacity>

        </View>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
    },
    logo: {
        width: 200,
        height: 150,
        marginTop: 0,
        marginBottom: 60,
        margin: "25%",
    },
    line: {
        height: 80,
        backgroundColor: '#6CCCFC',
        justifyContent: "center",
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

