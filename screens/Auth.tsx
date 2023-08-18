import { Text } from 'react-native-paper';
import {StyleSheet, View} from "react-native";
import  TextInput from '../components/TextInput';
import  Button from '../components/Button';
import React, {useEffect} from "react";
import {useSecureStorage} from "../hooks/useSecureStorage";

const Auth = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isAlreadyRegistered, setIsAlreadyRegistered] = React.useState(false);

    const {getItem, isSecureStorageEnabled} = useSecureStorage()

    useEffect(() => {
        if (!isSecureStorageEnabled) {
            return
        }
        getItem('scanpay_session').then((value) => {
            if (value) {
                setIsAlreadyRegistered(true)
            }
        })
    }, [getItem]);

    const getHeadings = () => {
        if (isAlreadyRegistered) {
            return {
                headline: 'Login',
                title: 'Welcome back, please login to continue'
            }
        }
        return {
            headline: 'New Registration',
            title: 'Welcome, please fill the below form to get started'
        }
    }

    return <>
        <View style={styles.container}>
            <View  style={styles.sections}>
                <Text variant="headlineSmall">{getHeadings().headline}</Text>
                <Text variant="titleSmall">{getHeadings().title}</Text>
            </View>
            <View style={styles.sections}>
                {
                    !isAlreadyRegistered && (
                        <TextInput
                            mode="outlined"
                            label="Email"
                            placeholder="Type something"
                            autoCapitalize="none"
                            textContentType="emailAddress"
                            keyboardType="email-address"
                        />
                    )
                }
                <TextInput
                    mode="outlined"
                    label="Password"
                    placeholder="Type something"
                    secureTextEntry

                />
                <Button mode="contained">
                    {
                        isAlreadyRegistered ? 'Login' : 'Register'
                    }
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