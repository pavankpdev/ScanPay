import { Text } from 'react-native-paper';
import {StyleSheet, View} from "react-native";
import  TextInput from '../components/TextInput';
import  Button from '../components/Button';
import React from "react";

const Auth = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    return <>
        <View style={styles.container}>
            <View  style={styles.sections}>
                <Text variant="headlineSmall">New Registration</Text>
                <Text variant="titleSmall">Welcome, please fill the below form to get started </Text>
            </View>
            <View style={styles.sections}>
                <TextInput
                    mode="outlined"
                    label="Email"
                    placeholder="Type something"
                    autoCapitalize="none"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                />
                <TextInput
                    mode="outlined"
                    label="Password"
                    placeholder="Type something"
                    secureTextEntry

                />
                <Button mode="contained">
                    Login
                </Button>
            </View>
        </View>
    </>
}


const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 100,
        paddingBottom: 100,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sections: {
        width: '100%'

    },
    input: {
        width: '100%'
    }

});
export default Auth;