import {SafeAreaView, StyleSheet, View} from "react-native";
import { Text } from 'react-native-paper';
import * as React from "react";
import {BigNumber, ethers} from "ethers";
import TextInput from "../components/TextInput";
import {useNetwork} from "../context/network";
import Button from "../components/Button"
import {useAccount} from "../context/account";
import {createProvider, createSigner} from "../utils/provider";
import {useSecureStorage} from "../hooks/useSecureStorage";
import {useMutation} from "react-query";
import {useEffect} from "react";

const Payment = ({route, navigation}: {route: any, navigation: any}) => {
    const [amount, setAmount] = React.useState('0');
    const [error, setError] = React.useState('');

    const {balance, estimatedGas, network} = useNetwork()
    const {wallet} = useAccount()
    const {getItem} = useSecureStorage()

    useEffect(() => {
        if(parseFloat(amount) > 0) {
            const isGreaterThanBalance = ethers.utils.parseEther(amount).gt(balance)
            if(isGreaterThanBalance) {
                setError('Insufficient balance')
                return
            }
            setError('')
        }
    }, [amount]);

    const {
        mutate: initiateTransfer,
        isLoading
    } = useMutation({
        mutationKey: ['initiateTransfer'],
        mutationFn: async () => {
            const provider = createProvider(network)
            const session = await getItem('scanpay_session')

            const selectedWallet = (JSON.parse(session)).wallets.find((w: {address: string}) => w.address === wallet?.address)
            console.log({pvt: selectedWallet?.privateKey})
            const signer = createSigner(selectedWallet?.privateKey as string, network)

            const nonce = await provider.getTransactionCount(wallet?.address as string, "latest")

            const tx = {
                from: wallet?.address,
                to: route?.params?.address,
                value: ethers.utils.parseEther(amount),
                nonce: 2,
                gasLimit: '100000', // 100000
                gasPrice: BigNumber.from(estimatedGas).toString(),
            }

            const txn = await signer.sendTransaction(tx).catch(console.log)
            console.log(txn)
        }
    })

    const cancelTxn = () => {
        navigation.navigate('Wallet')
    }

    return <>
        <SafeAreaView style={styles.container}>
            <Text variant="headlineMedium" style={{fontWeight: '700'}}>Send Funds</Text>
            <View style={{
                padding: 20,
                paddingTop: 10,
                paddingBottom: 10,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f5eaff',
                borderRadius: 10
            }}>
                <Text variant="titleSmall" style={{color: '#7339ac'}}>Sending to</Text>
                <Text
                    style={{fontWeight: '600', fontSize: 15}}
                >
                    {route?.params?.address}
                </Text>
            </View>
            <TextInput
                mode="outlined"
                label="Amount"
                placeholder="0.10"
                returnKeyType="next"
                autoCapitalize="none"
                value={amount}
                onChangeText={(text) => setAmount(text)}
                keyboardType='numeric'
                description={`Bal: ${parseFloat(ethers.utils.formatEther(balance || "0")).toFixed(3)} ${network?.token}`}
                error={Boolean(error)}
                errorText={error}
            />
            <View style={{
                padding: 20,
                paddingTop: 10,
                paddingBottom: 10,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f8fafc',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#cbd5e1'
            }}>
                <Text variant="titleSmall" style={{color: '#475569'}}>Estimated Gas</Text>
                <Text
                    style={{fontWeight: '600', fontSize: 20}}
                >
                    {ethers?.utils?.formatEther(estimatedGas || "0")} {network?.token}
                </Text>
            </View>
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
                <Text variant="titleSmall" style={{color: '#7339ac'}}>Grand Total (Gas + Amount)</Text>
                <Text
                    style={{fontWeight: '600', fontSize: 20}}
                >
                    {
                        ethers.utils.formatEther(BigNumber.from(ethers?.utils.parseEther(amount || "0")).add(estimatedGas).toString())
                    } {network?.token}
                </Text>
            </View>
            <View
                style={{
                    flexDirection: 'column'
                }}
            >
                <Button
                    mode={'contained'}
                    onPress={() => initiateTransfer()}
                    loading={isLoading}
                >
                    Confirm
                </Button>
                <Button mode={'outlined'} onPress={cancelTxn}>
                    Cancel
                </Button>
            </View>
        </SafeAreaView>
    </>
}
const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 70,
        paddingBottom: 50,
        backgroundColor: '#fff',
        height: '100%',
        flexDirection: 'column',
        gap: 20,
    },
});

export default Payment;