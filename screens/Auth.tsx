import { Text } from 'react-native-paper';
import {StyleSheet, View} from "react-native";
import  TextInput from '../components/TextInput';
import  Button from '../components/Button';
import React, {useEffect} from "react";
import {useSecureStorage} from "../hooks/useSecureStorage";
import {useMutation} from "react-query";
import {generateNewSeed} from "../helpers/generateNewSeed";
import { Snackbar } from 'react-native-paper';
import {validatePassword} from "../helpers/validatePassword";

const Auth = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isAlreadyRegistered, setIsAlreadyRegistered] = React.useState(false);
    const [showNotification, setShowNotification] = React.useState(false);

    const {getItem, isSecureStorageEnabled, setItem} = useSecureStorage()

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

    const {
        mutate: generateNewSeedMutation,
        isLoading: isGeneratingNewSeed,
        isError: isGeneratingNewSeedError,
        error: newSeedGenerationError,
    } = useMutation({
        mutationFn: async () => generateNewSeed(password, email),
        mutationKey: 'generateNewSeed',
        onSuccess: (data) => {
            setPassword('')
            setEmail('')
            setItem('scanpay_session', JSON.stringify({
                email,
                password,
                seed: data.data.seed,
            })).then(() => {
                setShowNotification(true)
            })
        }
    })

    const {
        mutate: validatePasswordMutation,
        isLoading: isValidatingPassword,
        isError: isValidatePasswordError,
        error: validatePasswordError,
    } = useMutation({
        mutationFn: async () => validatePassword(password),
        mutationKey: 'validatePassword',
        onSuccess: (data) => {
            setPassword('')
            setEmail('')
            setShowNotification(true)
        },
    })

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
        <Snackbar
            visible={showNotification}
            onDismiss={() => setShowNotification(false)}
            action={{
                label: 'Close',
            }}>
            Successfully registered ⭐
        </Snackbar>
        <View style={styles.container}>
            <View  style={styles.sections}>
                <Text variant="headlineSmall" style={{fontWeight: '700'}} >{getHeadings().headline}</Text>
                <Text variant="titleSmall"  style={{color: "#475569"}}>{getHeadings().title}</Text>
            </View>
            <View style={styles.sections}>
                {
                    !isAlreadyRegistered && (
                        <TextInput
                            mode="outlined"
                            label="Email"
                            placeholder="Type something"
                            returnKeyType="next"
                            autoCapitalize="none"
                            textContentType="emailAddress"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
                    )
                }
                <TextInput
                    mode="outlined"
                    label="Password"
                    placeholder="Type password"
                    returnKeyType="done"
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                <Button
                    mode="contained"
                    loading={isGeneratingNewSeed || isValidatingPassword}
                    onPress={ isAlreadyRegistered ? () => validatePasswordMutation() : () => generateNewSeedMutation()}
                >
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