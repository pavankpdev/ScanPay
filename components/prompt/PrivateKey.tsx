import * as React from 'react';
import { Modal, Portal, Text, Snackbar } from 'react-native-paper';
import WalletUtilityBtn from "../WalletUtilityBtn";
import {View} from "react-native";
import TextInput from "../TextInput";
import {useNetwork} from "../../context/network";
import {BigNumber, ethers} from "ethers";
import CustomButton from "../Button"
import {useEffect} from "react";
import {useMutation} from "react-query";
import {useSecureStorage} from "../../hooks/useSecureStorage";
import Clipboard from "expo-clipboard";
import {useAccount} from "../../context/account";

const PrivateKey = () => {
    const [visible, setVisible] = React.useState(false);
    const [password, setPassword] = React.useState('');

    const {getItem} = useSecureStorage()
    const {wallet} = useAccount()

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

    const {
        mutate: validatePasswordMutation,
        isLoading: isValidatingPassword,
        isSuccess: isValidPassword,
        data: privateKey,
    } = useMutation({
        mutationFn: async () => {
            const session = await getItem('scanpay_session')
            const sessionData = JSON.parse(session)
            if(sessionData?.password !== password) {
                throw new Error('Invalid password')
            }

            return sessionData?.wallets?.find((w: {address: string}) => w.address === wallet?.address)?.privateKey
        },
        mutationKey: 'validatePassword',
        onSuccess: async () => {
            setPassword('')
        },
    })

    const copyToClipboard = async () => {
        const Clipboard = require('expo-clipboard');
        await Clipboard.setStringAsync(privateKey || "");
        alert('Copied to clipboard')
        hideModal()
    };

    return (
            <View>
                <Portal>
                    <Modal
                        visible={visible}
                        onDismiss={hideModal}
                        contentContainerStyle={containerStyle}
                    >
                        <Text variant="titleLarge" style={{fontWeight: '700', color: '#7339ac'}}>Export Private Key</Text>
                        {
                            isValidPassword ?
                                (
                                    <>
                                        <View style={{
                                            padding: 20,
                                            paddingTop: 10,
                                            paddingBottom: 10,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            backgroundColor: '#f8fafc',
                                            borderRadius: 10,
                                            borderWidth: 1,
                                            borderColor: '#8d53c6'
                                        }}>
                                            <Text
                                                style={{fontWeight: '600', fontSize: 20}}
                                            >
                                                {privateKey}
                                            </Text>
                                        </View>
                                        <CustomButton
                                            mode="contained"
                                            onPress={copyToClipboard}
                                        >
                                            Copy
                                        </CustomButton>
                                    </>
                                ) :
                                (
                                    <>
                                        <TextInput
                                            mode="outlined"
                                            label="Password"
                                            placeholder="*******"
                                            autoCapitalize="none"
                                            value={password}
                                            secureTextEntry
                                            onChangeText={(text) => setPassword(text)}
                                        />
                                        <CustomButton
                                            mode="contained"
                                            onPress={() => validatePasswordMutation()}
                                            loading={isValidatingPassword}
                                        >
                                            Export
                                        </CustomButton>
                                    </>
                                )
                        }
                    </Modal>
                </Portal>
                <WalletUtilityBtn
                    icon={'key'}
                    text={'Private Key'}
                    onPress={showModal}
                />
            </View>
    );
};

export default PrivateKey;