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
import {useMutation, useQuery} from "react-query";
import {useEffect} from "react";
import TokenSelect from "../components/tokens/TokenSelect";
import {getTokenBalance} from "../helpers/getTokenBalance";
import {sendERC20Token} from "../helpers/sendERC20Token";

const Payment = ({route, navigation}: {route: any, navigation: any}) => {
    const [amount, setAmount] = React.useState('0');
    const [error, setError] = React.useState('');
    const [asset, setAsset] = React.useState<{
        name: string,
        symbol: string,
        address?: string,
        isNative?: boolean,
    } | null>(null);

    const {balance, estimatedGas, network} = useNetwork()
    const {wallet} = useAccount()
    const {getItem} = useSecureStorage()


    const {data: tokenBalance} = useQuery({
        queryFn: async () => {
            const session = await getItem('scanpay_session');

            const selectedWallet = JSON.parse(session).wallets.find((w: any) => w.address === wallet?.address);
            const signer = createSigner(selectedWallet.privateKey, network);
            return getTokenBalance(asset?.address as string, signer)
        },
        queryKey: ['tokenBalance', asset?.address],
        enabled: Boolean(asset?.address)
    })


    useEffect(() => {
        setError('')

        if(parseFloat(amount) > 0) {

            if(asset?.isNative) {
                const isGreaterThanBalance = ethers.utils.parseEther(amount).gt(balance)
                if(isGreaterThanBalance) {
                    setError('Insufficient balance')
                    return
                }

                return;
            }

            const isGreaterThanBalance = ethers.utils.parseEther(amount).gt(tokenBalance)
            if(isGreaterThanBalance) {
                setError('Insufficient balance')
                return
            }
            const isGreaterThanEstimatedGas = ethers.utils.parseEther(estimatedGas).gt(balance)
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

            const selectedWallet = JSON.parse(session).wallets.find((w: any) => w.address === wallet?.address);
            const signer = createSigner(selectedWallet.privateKey, network);

            const nonce = await provider.getTransactionCount(wallet?.address as string, "latest");
            const latestBlock = await provider.getBlock("latest");
            const baseFeePerGas = BigNumber.from(latestBlock.baseFeePerGas || 0);

            const priorityFee = '1000000000';

            const tx = {
                from: wallet?.address,
                to: route?.params?.address,
                value: ethers.utils.parseEther(amount),
                nonce: nonce + 1,
                gasLimit: '80000',
                gasPrice: baseFeePerGas.add(BigNumber.from(priorityFee)), // priorityFee to speed up transaction
            };

            const txn = await signer.sendTransaction(tx).catch(console.log);

            if (txn?.wait) {
                await txn.wait().catch(console.log);
            }

            if (txn?.hash) {
                alert(`Transaction initiated. Txn hash: ${txn.hash}`);
                navigation.navigate('Wallet');
            } else {
                alert(`Transaction failed.`);
            }
        }
    })

    const {
        mutate: initiateERC20Transfer,
        isLoading: isERC20TransferLoading
    } = useMutation({
        mutationKey: ['initiateERC20Transfer'],
        mutationFn: async () => {
            const provider = createProvider(network);
            const session = await getItem('scanpay_session');

            const selectedWallet = JSON.parse(session).wallets.find((w: any) => w.address === wallet?.address);
            const signer = createSigner(selectedWallet.privateKey, network);

            const nonce = await provider.getTransactionCount(wallet?.address as string, "latest");
            const latestBlock = await provider.getBlock("latest");
            const baseFeePerGas = BigNumber.from(latestBlock.baseFeePerGas || 0);

            const priorityFee = '1000000000';

            const tx = {
                from: wallet?.address,
                to: asset?.address,
                nonce: nonce + 1,
                gasLimit: '80000',
                gasPrice: baseFeePerGas.add(BigNumber.from(priorityFee)), // priorityFee to speed up transaction
            };

            const txn = await sendERC20Token(
                asset?.address as string,
                route?.params?.address,
                ethers.utils.parseEther(amount).toString(),
                signer,
                tx
            )

            if (txn?.wait) {
                await txn.wait().catch(console.log);
            }

            if (txn?.hash) {
                alert(`Transaction initiated. Txn hash: ${txn.hash}`);
                navigation.navigate('Wallet');
            } else {
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
            <TokenSelect
                handleChange={handleChange}
            />
            <TextInput
                mode="outlined"
                label="Amount"
                placeholder="0.10"
                returnKeyType="next"
                autoCapitalize="none"
                value={amount}
                onChangeText={(text) => setAmount(text)}
                keyboardType='numeric'
                description={
                `Bal: ${parseFloat(ethers.utils.formatEther((asset?.isNative ? balance : tokenBalance) || "0")).toFixed(3)} ${asset?.symbol || network?.token}`
            }
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
                <Text variant="titleSmall" style={{color: '#7339ac'}}>Grand Total (Amount + Gas)</Text>
                {
                    asset && !asset?.isNative && (
                        <Text
                            style={{fontWeight: '600', fontSize: 20}}
                        >
                            {
                                `${ethers.utils.formatEther(BigNumber.from(ethers?.utils.parseEther(amount || "0")).toString())} ${asset?.symbol}`
                            }
                        </Text>
                    )
                }
                <Text
                    style={{fontWeight: '600', fontSize: 20}}
                >
                    {
                        ethers.utils.formatEther(BigNumber.from(ethers?.utils.parseEther(asset?.isNative ? amount : "0" || "0")).add(estimatedGas).toString())
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
                    onPress={() => {
                        if (asset?.isNative) {
                            initiateTransfer()
                        } else {
                            initiateERC20Transfer()
                        }
                    }}
                    loading={isLoading || isERC20TransferLoading}
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