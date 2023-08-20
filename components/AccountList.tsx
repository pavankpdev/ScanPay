import * as React from 'react';
import {Modal, Portal, Text, Button, PaperProvider, Avatar, Text as PaperText} from 'react-native-paper';
import Icon from "react-native-vector-icons/Entypo";
import {StyleSheet, Touchable, TouchableOpacity, View} from "react-native";
import {useNetwork} from "../context/network";
import {supportedChains} from "../utils/provider";
import FAIcon from "react-native-vector-icons/FontAwesome"
import wallet from "../screens/Wallet";
import {useAccount, Wallet} from "../context/account";
import {useMutation, useQuery} from "react-query";
import {useSecureStorage} from "../hooks/useSecureStorage";
import {createNewWallet} from "../helpers/createNewWallet";

const AccountList = () => {
    const [visible, setVisible] = React.useState(false);

    const {network, setNetwork} = useNetwork()
    const {wallet, setWallet} = useAccount()
    const {getItem, setItem} = useSecureStorage()
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

    const {data: wallets, refetch} = useQuery({
        queryKey: ['account'],
        queryFn: async () => {
            const session = await getItem('scanpay_session')
            if(!session) return
            const {wallets} = JSON.parse(session)

            return wallets
        }
    })

    const {
        mutate: createAccount,
        isLoading: isCreatingAccount
    } = useMutation({
        mutationKey: ['create_account'],
        mutationFn: async () => {
            const session = await getItem('scanpay_session')
            const sessionData = JSON.parse(session)
            return createNewWallet(
                sessionData.seed,
                "Account",
                sessionData.password,
                sessionData.email
            )
        },
        onSuccess: async (data) => {
            const session = await getItem('scanpay_session')
            const sessionData = JSON.parse(session)

            const newWallets = [
                ...sessionData.wallets,
                data.data
            ];

            console.log({
                ...sessionData,
                wallets: newWallets
            })

            await setItem('scanpay_session', JSON.stringify({
                ...sessionData,
                wallets: newWallets
            }))

            refetch()
        }
    })

    return (
        <>
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={hideModal}
                    contentContainerStyle={containerStyle}
                >
                    <Text variant="titleLarge" style={{fontWeight: '700', color: '#7339ac'}}>Switch Chains</Text>
                    <Text variant="titleSmall" style={{fontWeight: '600', marginTop: -10}}>Select any of the supported chain below</Text>
                    <View style={{marginTop: 20}}>
                        {
                            wallets && wallets.map((w: Wallet, index: number) => {

                                const isSelected = w?.address === wallet?.address

                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setWallet({
                                                ...w,
                                                name: `Account ${index + 1}`
                                            })
                                            hideModal()
                                        }}
                                        key={index}
                                    >
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: 10,
                                            borderRadius: 10,
                                            borderWidth: 1,
                                            borderColor: '#3730a3',
                                            marginBottom: 10
                                        }}>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    gap: 10,
                                                }}
                                            >
                                                <Avatar.Text size={24} label={w?.name[0]} />
                                                <Text>
                                                    {`Account ${index + 1}`}
                                                </Text>
                                            </View>
                                            {
                                                isSelected && (
                                                    <FAIcon name="check" size={20} color="#3730a3" />
                                                )
                                            }
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                        <Button
                            onPress={() => createAccount()}
                            loading={isCreatingAccount}
                        >
                            Add New Wallet
                        </Button>
                    </View>
                </Modal>
            </Portal>
            <TouchableOpacity
                onPress={showModal}
            >
                <View style={styles.accountList}>
                    <Avatar.Text size={24} label={wallet ? (wallet?.name as string)[0] : "UN"}/>
                    <PaperText variant="titleMedium">{wallet?.name}</PaperText>
                    <Icon name="chevron-down" size={20} color="#000" />
                </View>
            </TouchableOpacity>
        </>
    );
};
const styles = StyleSheet.create({
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
export default AccountList;