import { Stack, useRouter } from 'expo-router';
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import {Image} from "expo-image";
export default function PaymentMethods() {
    const router = useRouter();
    const Redirect = (path: string) => {
        router.push(path as any);
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={options} />
            <TouchableOpacity
                onPress={() => Redirect('/FormPage')}
                style={[styles.subcontainer, { backgroundColor: '#333' }]}
            >
                <Image 
                    source={require('@/assets/bank.png')}
                    style={{width: 50, height: 50}}
                />
                <Text style={styles.title}>Site Expenditures</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => Redirect('/paymentdetails')}
                style={[styles.subcontainer, { backgroundColor: '#333' }]}
            >
                <Image 
                    source={require('@/assets/payment-method.png')}
                    style={{width: 50, height: 50}}
                />
                <Text style={styles.title}>Material and PO payments</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => Redirect('/Generals')}
                style={[styles.subcontainer, { backgroundColor: '#333' }]}
            >
                <Image 
                    source={require('@/assets/payment.png')}
                    style={{width: 50, height: 50}}
                />
                <Text style={styles.title}>General</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#222",
        alignItems: 'center',
        justifyContent: "flex-start",
        width: "100%",
    },
    title: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    subcontainer: {
        flexDirection: "row",
        width: "90%",
        marginVertical: 5,
        padding: 10,
        paddingEnd:25,
        borderRadius: 15,
        height: 100,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        alignContent:'space-between',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'linear-gradient(45deg, #1c1c1c, #444)', // Gradient background
        transform: [{ scale: 1 }],

    },
    subcontainerPressed: {
        transform: [{ scale: 0.95 }],
    }
});

const options: NativeStackNavigationOptions = {
    title: "Payment",
    headerStyle: {
        backgroundColor: "#222",
    },
    headerTintColor: "#fff",
};
