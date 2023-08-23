import {SafeAreaView, ScrollView, StatusBar, StyleSheet, View} from "react-native";
import { Text } from 'react-native-paper';
import * as React from "react";
import {BigNumber, ethers} from "ethers";
import TextInput from "../components/TextInput";
import {useNetwork} from "../context/network";
import Button from "../components/Button"
import {useAccount} from "../context/account";
import {createProvider, createSigner} from "../utils/provider";
import {useSecureStorage} from "../hooks/useSecureStorage";
import {useMutation, useQuery} from "react-query";
import {useEffect} from "react";

const Payment = ({route, navigation}: {route: any, navigation: any}) => {
    const [amount, setAmount] = React.useState('0');
    const [error, setError] = React.useState('');
    const {balance, estimatedGas, network} = useNetwork()

    const [asset, setAsset] = React.useState<{
        name: string,
        symbol: string,
        address?: string,
        isNative?: boolean,
    } | null>({
        name: network.name,
        symbol: network.token,
        isNative: true
    });

    const {wallet} = useAccount()
    const {getItem} = useSecureStorage()

    useEffect(() => {
        setError('')

        if(parseFloat(amount) > 0) {

            if(asset?.isNative) {
                const isGreaterThanBalance = ethers.utils.parseEther(amount || '0').gt(balance)
                if(isGreaterThanBalance) {
                    setError('Insufficient balance')
                    return
                }

                return;
            }


            const isGreaterThanEstimatedGas = ethers.utils.parseEther(estimatedGas || '0').gt(balance)
            if(isGreaterThanEstimatedGas) {
                setError(`Insufficient ${network?.token} balance for gas`)
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
            const provider = createProvider(network);
            const session = await getItem('scanpay_session');

            // Get the selected wallet from the session
            const selectedWallet = JSON.parse(session).wallets.find((w: any) => w.address === wallet?.address);
            const signer = createSigner(selectedWallet.privateKey, network);

            // Get the current nonce for the sender's address
            const nonce = await provider.getTransactionCount(wallet?.address as string, "latest");

            // Get the latest block to determine the base fee per gas
            const latestBlock = await provider.getBlock("latest");
            const baseFeePerGas = BigNumber.from(latestBlock.baseFeePerGas || 0);

            // Set the priority fee in Wei
            const priorityFeeWei = '1000000000'; // 1 Gwei in Wei

            // Construct the transaction object
            const tx = {
                from: wallet?.address,
                to: route?.params?.address,
                value: ethers.utils.parseEther(amount || "0.1"), // Convert amount to Wei
                nonce: nonce, // Use nonce one higher than the current nonce
                gasLimit: '21000', // Set an appropriate gas limit
                gasPrice:  baseFeePerGas.add(priorityFeeWei), // Combine base fee and priority fee
            };

            try {
                // Send the transaction and get the transaction response
                const txn = await signer.sendTransaction(tx);
                console.log(txn)
                if(txn?.wait) {
                    // Wait for the transaction to be mined
                    await txn.wait().catch(console.log);
                }

                if (txn?.hash) {
                    // Transaction successfully initiated
                    alert(`Transaction initiated. Txn hash: ${txn.hash}`);
                    console.log(txn.hash)
                    navigation.navigate('Wallet'); // Navigate to the wallet screen
                } else {
                    // Transaction failed
                    alert(`Transaction failed.`);
                }
            } catch (error) {
                // Handle transaction error
                console.log("Transaction error:", error);
                alert(`Transaction failed.`);
            }
        }
    })

    const cancelTxn = () => {
        navigation.navigate('Wallet')
    }

    const handleChange = (value: any) => {
        setAsset(value)
    }

    return <>
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text variant="headlineMedium" style={{fontWeight: '700', marginTop: 10}}>Send Funds</Text>
                <View style={{
                    padding: 20,
                    paddingTop: 10,
                    paddingBottom: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#f5eaff',
                    borderRadius: 10,
                    marginTop: 20
                }}>
                    <Text variant="titleSmall" style={{color: '#7339ac', }}>Sending to</Text>
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
                    onChangeText={(text) => text && setAmount(text)}
                    keyboardType='numeric'
                    description={
                    `Bal: ${parseFloat(ethers.utils.formatEther((balance) || "0")).toFixed(3)} ${asset?.symbol || network?.token}`
                }
                    error={Boolean(error)}
                    errorText={error}
                    style={{
                        marginTop: 20
                    }}
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
                    borderColor: '#cbd5e1',
                    marginTop: 20

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
                    borderColor: '#8d53c6',
                    marginTop: 20
                }}>
                    <Text variant="titleSmall" style={{color: '#7339ac'}}>Grand Total (Amount + Gas)</Text>
                    {
                        asset && !asset?.isNative && (
                            <Text
                                style={{fontWeight: '600', fontSize: 20}}
                            >
                                {
                                    `${ethers.utils.formatEther(BigNumber.from(ethers?.utils.parseEther(amount || "0") || '0').toString())} ${asset?.symbol}`
                                }
                            </Text>
                        )
                    }
                    <Text
                        style={{fontWeight: '600', fontSize: 20}}
                    >
                        {
                            ethers.utils.formatEther(BigNumber.from(ethers?.utils.parseEther(asset?.isNative ? amount : "0" || "0") || '0').add(estimatedGas  || '0').toString())
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
                        style={{
                            marginTop: 20
                        }}
                    >
                        Confirm
                    </Button>
                    <Button mode={'outlined'} onPress={cancelTxn}>
                        Cancel
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    </>
}
const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: StatusBar.currentHeight,
        paddingBottom: 50,
        backgroundColor: '#fff',
        height: '100%',

    },
    scrollView: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
    },
});

export default Payment;