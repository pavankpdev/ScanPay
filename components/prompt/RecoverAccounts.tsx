import { Modal, Portal, Text, Button } from 'react-native-paper';
import React from "react";
import TextInput from "../TextInput";
import {useMutation} from "react-query";
import {recoverAccount} from "../../helpers/recoverAccount";
import {useSecureStorage} from "../../hooks/useSecureStorage";

const RecoverAccounts = ({navigation}: {navigation: any}) => {
    const [visible, setVisible] = React.useState(false);
    const [mnemonic, setMnemonic] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const {setItem} = useSecureStorage()

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = {
        backgroundColor: '#fff',
        padding: 20,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#3730a3',
        gap: 10
    };

    const {mutate: recover, isLoading} = useMutation({
        mutationFn: async () => recoverAccount(mnemonic, email, password),
        mutationKey: 'recoverAccount',
        onSuccess: async ({data}) => {
            setMnemonic('')
            setEmail('')
            setPassword('')
            console.log({
                email,
                password,
                seed: data.seed,
                mnemonic,
                wallets: data.wallets
            })

            await setItem('scanpay_session', JSON.stringify({
                email,
                password,
                seed: data.seed,
                mnemonic,
                wallets: data.wallets
            }))
            hideModal()
            navigation.navigate('Wallet')
        },
        onError: (error) => {
            alert(`Error: ${error?.message || "Something went wrong"}`)
        }
    })

    return (
        <>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    <Text variant="titleSmall" style={{color: "#475569"}}>
                        Enter the details below to recover your account
                    </Text>
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
                    <TextInput
                        mode="outlined"
                        label="Mnemonic Phrase"
                        placeholder="Paste your mnemonic phrase here"
                        autoCapitalize="none"
                        value={mnemonic}
                        onChangeText={(text) => setMnemonic(text)}
                        multiline={true}
                        numberOfLines={6}
                    />
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
                        style={{marginTop: 15}}
                        onPress={() => recover()}
                        mode={'contained'}
                        loading={isLoading}
                    >
                        Recover Account
                    </Button>
                </Modal>
            </Portal>
            <Button style={{marginTop: 30}} onPress={showModal} mode={'outlined'}>
                Recover Account
            </Button>
        </>
    );
}

export default RecoverAccounts