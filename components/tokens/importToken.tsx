import {Modal, Portal, Text, Button, PaperProvider, Avatar, Text as PaperText} from 'react-native-paper';
import React from "react";
import TextInput from "../TextInput";
import CustomButton from "../Button";
import {useQuery} from "react-query";
import {BigNumber, ethers} from "ethers";
import {createSigner} from "../../utils/provider";
import {useSecureStorage} from "../../hooks/useSecureStorage";
import {useNetwork} from "../../context/network";
import {getTokenName} from "../../helpers/getTokenName";
import {getTokenSymbol} from "../../helpers/getTokenSymbol";
import {useAccount} from "../../context/account";
import {StyleSheet, View} from "react-native";
import {getTokenBalance} from "../../helpers/getTokenBalance";

const ImportToken = () => {
    const [visible, setVisible] = React.useState(false);
    const [address, setAddress] = React.useState('');

    const {getItem, setItem} = useSecureStorage()
    const {network} = useNetwork()
    const {wallet} = useAccount()
    const showModal = () => setVisible(true);
    const hideModal = () => {
        setAddress('')
        setVisible(false)
    };
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

    const {data, isFetching: isSearching, error, isError} = useQuery({
        queryKey: ['imporToken', address],
        queryFn: async () => {
            if(address.length === 42) {
                const session = await getItem('scanpay_session');

                const selectedWallet = JSON.parse(session).wallets.find((w: any) => w.address === wallet?.address);
                const signer = createSigner(selectedWallet.privateKey, network);

                const name = await getTokenName(address, signer)
                const symbol = await getTokenSymbol(address, signer)
                const balance = await getTokenBalance(address, signer)

                return {
                    name,
                    symbol,
                    balance
                }
            }
        },
        enabled: address.length === 42
    })
    const addToken = async () => {
        const session = await getItem('scanpay_session');
        const sessionData = JSON.parse(session);
        let tokens = [];

        if(sessionData?.tokens) {

            if(sessionData?.tokens.some((t: any) => t.address === address)) {
                alert('Token already added')
                return
            }

            tokens = [
                ...sessionData.tokens,
                {
                    address,
                    name: data?.name,
                    symbol: data?.symbol,
                    chainId: network.chainId,
                }
            ];
        } else {
            tokens = [
                {
                    address,
                    name: data?.name,
                    symbol: data?.symbol,
                    chainId: network.chainId,
                }
            ]
        }

        await setItem('scanpay_session', JSON.stringify({
            ...sessionData,
            tokens
        }))
    }

    return (
        <>
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={hideModal}
                    contentContainerStyle={containerStyle}
                >
                    <Text variant="titleLarge" style={{fontWeight: '700', color: '#7339ac'}}>Import Token</Text>
                    <TextInput
                        mode="outlined"
                        label="Token Address"
                        placeholder="0x13sS34Faf....."
                        returnKeyType="next"
                        autoCapitalize="none"
                        value={address}
                        onChangeText={(text) => setAddress(text)}
                    />
                    {
                        !data && isSearching && (
                            <View style={styles.accountList}>
                                <PaperText variant="titleMedium">Searching...</PaperText>
                            </View>
                        )
                    }
                    {
                        !data && isError && (
                            <View style={styles.errorContainer}>
                                <PaperText variant="titleMedium">{"Invalid Token address or Try switching the chain"}</PaperText>
                            </View>
                        )
                    }
                    {data && (
                        <View style={styles.accountList}>
                            <View style={{
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 10,
                            }}>
                                <Avatar.Text size={24} label={data?.name ? (data?.name as string)[0] : "UN"}/>
                                <PaperText variant="titleMedium">{data?.name}</PaperText>
                            </View>
                            <PaperText variant="titleMedium">{
                                parseFloat(ethers.utils.formatEther(BigNumber.from(data?.balance).toString())).toFixed(2)
                            } ${data?.symbol}</PaperText>
                        </View>
                    )}
                    {
                        data &&
                        (
                            <CustomButton
                                mode="contained"
                                onPress={addToken}
                            >
                                Import
                            </CustomButton>
                        )
                    }
                </Modal>
            </Portal>
            <Button
                onPress={showModal}
            >
                Import New Token
            </Button>
        </>
    );
}
const styles = StyleSheet.create({
    accountList: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#3730a3',
        backgroundColor: '#eef2ff',
        width: '100%'
    },
    errorContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ef4444',
        backgroundColor: '#fee2e2',
        width: '100%'
    }
});
export default ImportToken