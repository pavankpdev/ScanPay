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

import WalletUtilityBtn from "../components/WalletUtilityBtn";
const Wallet = ({navigation}: {navigation: any}) => {
    const [value, setValue] = React.useState('Tokens');

    const {getItem} = useSecureStorage()

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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.networkList}>
                    <Text style={{color: '#fff'}}>EM</Text>
                    <Icon name="chevron-down" size={20} color="#fff" />
                </View>
                <View style={styles.accountList}>
                    <Avatar.Text size={24} label="A1" />
                    <PaperText variant="titleMedium">Account 1</PaperText>
                    <Icon name="chevron-down" size={20} color="#000" />
                </View>
            </View>
            <View style={styles.walletView}>
                <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Chip
                        onPress={() => console.log('Pressed')}
                        style={{
                            backgroundColor: '#f5eaff',
                            borderRadius: 50,
                            padding: 10,
                            paddingTop: 5,
                            paddingBottom: 5,
                        }}
                    >
                        <PaperText style={{color: '#7339ac'}} variant="titleMedium" >0x013..1Ae {" "}</PaperText>
                        <FAIcon name="copy" size={15} color="#7339ac" />
                    </Chip>
                </View>
                <PaperText variant="displaySmall" style={{fontWeight: '700', color: '#1e1b4b'}}>38 ETH</PaperText>
                <View style={styles.utilityIcons}>
                    <WalletUtilityBtn
                        icon={'qrcode-scan'}
                        text={'Scan'}
                    />
                    <WalletUtilityBtn
                        icon={'arrow-top-right'}
                        text={'Send'}
                    />
                    <WalletUtilityBtn
                        icon={'arrow-bottom-left'}
                        text={'Receive'}
                    />
                    <WalletUtilityBtn
                        icon={'key'}
                        text={'Private Key'}
                    />
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
            </View>
        </SafeAreaView>
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