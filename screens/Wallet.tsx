import {useSecureStorage} from "../hooks/useSecureStorage";
import React, {useEffect} from "react";
import {View, Text, StyleSheet} from "react-native";
import { Text as PaperText } from 'react-native-paper';
import { Avatar } from 'react-native-paper';
import { Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Entypo';
import FAIcon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import {useNetwork} from "../context/network";

import WalletUtilityBtn from "../components/WalletUtilityBtn";
import {useQuery} from "react-query";
import {BigNumber, ethers} from "ethers";
import {useAccount} from "../context/account";
import Activities from "../components/activities";
import Send from "../components/prompt/Send";
import QRScanner from "../components/prompt/QRScanner";
import Receive from "../components/prompt/Receive";
import PrivateKey from "../components/prompt/PrivateKey";
import ChainList from "../components/ChainList";
import AccountList from "../components/AccountList";
import ImportToken from "../components/tokens/importToken";
import Tokens from "../components/tokens";
const Wallet = ({navigation}: {navigation: any}) => {
    const [value, setValue] = React.useState('Activities');
    const [isScannerVisible, setIsScannerVisible] = React.useState(false);

    const {getItem} = useSecureStorage()
    const {setWallet, wallet: selectedWallet} = useAccount()
    const {balance, isFetchingBalance, network} = useNetwork()

    useEffect(() => {
        getItem('scanpay_session').then((value) => {
            if (!value) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Auth' }],
                })
            }
            console.log(value)
        })
    }, []);

    useQuery({
        queryFn: async () => {
            const session = await getItem('scanpay_session')
            if(!session) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Auth' }],
                })
                return
            }

            const {wallets} = JSON.parse(session)
            setWallet(wallets[0])
        }
    })

    const handleScannedData = (data: any) => {
        if(ethers.utils.isAddress(data)) {
            navigation.navigate('Payment', {
                address: data
            })
            return
        }
        alert('Invalid QR Code')
    }

    const copyToClipboard = async () => {
        const Clipboard = require('expo-clipboard');
        await Clipboard.setStringAsync(selectedWallet?.address as string);
    };

    return (
        <>
            <SafeAreaView style={styles.container}>
                <QRScanner
                    showScanner={isScannerVisible}
                    callBack={handleScannedData}
                    setShowScanner={setIsScannerVisible}
                />
                <View style={styles.header}>
                    <ChainList />
                    <AccountList />
                </View>
                <View style={styles.walletView}>
                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Chip
                            onPress={copyToClipboard}
                            style={{
                                backgroundColor: '#f5eaff',
                                borderRadius: 50,
                                padding: 10,
                                paddingTop: 5,
                                paddingBottom: 5,
                            }}
                        >
                            <PaperText style={{color: '#7339ac'}} variant="titleMedium" >{`${selectedWallet?.address.slice(0,5)}...${selectedWallet?.address.slice(-3)}`} {" "}</PaperText>
                            <FAIcon name="copy" size={15} color="#7339ac" />
                        </Chip>
                    </View>
                    <PaperText variant="displaySmall" style={{fontWeight: '700', color: '#1e1b4b'}}>
                        {isFetchingBalance ? 'Loading...' : parseFloat(ethers.utils.formatEther(balance || "0")).toFixed(3)} {network?.token}
                    </PaperText>
                    <View style={styles.utilityIcons}>
                        <WalletUtilityBtn
                            icon={'qrcode-scan'}
                            text={'Scan'}
                            onPress={() => setIsScannerVisible(true)}
                        />
                        <Send
                            navigation={navigation}
                        />
                        <Receive />
                        <PrivateKey  />
                    </View>
                </View>
                <View>
                    <SegmentedButtons
                        value={value}
                        onValueChange={setValue}
                        buttons={[
                            {
                                value: 'Tokens',
                                label: 'Tokens',
                            },
                            {
                                value: 'Activities',
                                label: 'Activities',
                            }
                        ]}
                    />
                </View>
                <View>
                    {
                        value === 'Activities'
                            ?
                            <Activities />
                            :
                            <View>
                                <Tokens />
                                <ImportToken />
                            </View>
                    }
                </View>
            </SafeAreaView>
        </>
    )
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
        flex: 1,
    },
    walletView: {
        width: '100%',
        backgroundColor: '#f8fafc',
        padding: 20,
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 20,
    },
    utilityIcons: {
      width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    networkList: {
        backgroundColor: '#1e1b4b',
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 10,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#3730a3',
        gap: 10,
        alignItems: 'center',
    },
    accountList: {
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        gap: 10,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#3730a3',
        backgroundColor: '#eef2ff'
    }
});

export default Wallet