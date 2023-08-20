import * as React from 'react';
import { Modal, Portal, Text, Snackbar } from 'react-native-paper';
import WalletUtilityBtn from "../WalletUtilityBtn";
import {View} from "react-native";
import TextInput from "../TextInput";
import {useNetwork} from "../../context/network";
import {ethers} from "ethers";
import CustomButton from "../Button"
import {useEffect} from "react";

type Props = {
    navigation: any
}

const Send = ({navigation}: Props) => {
    const [visible, setVisible] = React.useState(false);
    const [address, setAddress] = React.useState('');

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

    const redirectToPayment = () => {
        if(!address) return
        hideModal()
        navigation.navigate('Payment', {
            address
        })
    }

    return (
            <View>
                <Portal>
                    <Modal
                        visible={visible}
                        onDismiss={hideModal}
                        contentContainerStyle={containerStyle}
                    >
                        <Text variant="titleLarge" style={{fontWeight: '700', color: '#7339ac'}}>Transfer Crypto</Text>
                        <TextInput
                            mode="outlined"
                            label="Recipient Address"
                            placeholder="0x13sS34Faf....."
                            returnKeyType="next"
                            autoCapitalize="none"
                            value={address}
                            onChangeText={(text) => setAddress(text)}
                        />
                        <CustomButton
                            mode="contained"
                            onPress={redirectToPayment}
                        >
                            Transfer
                        </CustomButton>
                    </Modal>
                </Portal>
                <WalletUtilityBtn
                    icon={'arrow-top-right'}
                    text={'Send'}
                    onPress={showModal}
                />
            </View>
    );
};

export default Send;