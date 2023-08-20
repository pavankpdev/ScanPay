import * as React from 'react';
import { Modal, Portal, Text, Snackbar } from 'react-native-paper';
import WalletUtilityBtn from "../WalletUtilityBtn";
import {View, StyleSheet, Image} from "react-native";
import CustomButton from "../Button"
import {useAccount} from "../../context/account";
import {genQR} from "../../utils/genQR";
const Receive = () => {
    const [visible, setVisible] = React.useState(false);

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
    };

    const copyToClipboard = async () => {
        const Clipboard = require('expo-clipboard');
        await Clipboard.setStringAsync(wallet?.address as string);
    };


    return (
            <View>
                <Portal>
                    <Modal
                        visible={visible}
                        onDismiss={hideModal}
                        contentContainerStyle={containerStyle}
                    >
                        <Text variant="titleLarge" style={{fontWeight: '700', color: '#7339ac'}}>Receive Crypto</Text>
                        <View style={styles.container}>
                            <View style={styles.qrContainer}>
                                <Image
                                    source={{uri: genQR(wallet?.address as string)}}
                                    style={styles.image}
                                />
                            </View>
                            <CustomButton
                                mode="outlined"
                                onPress={copyToClipboard}
                            >
                                Copy {`${(wallet?.address as string).slice(0,4)}...${(wallet?.address as string).slice(-4)}`}
                            </CustomButton>
                            <CustomButton
                                mode="contained"
                            >
                                Share
                            </CustomButton>
                        </View>
                    </Modal>
                </Portal>
                <WalletUtilityBtn
                    icon={'arrow-bottom-left'}
                    text={'Receive'}
                    onPress={showModal}
                />
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    qrContainer: {
        width: 200,
        height: 200,
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'contain'
    }
});

export default Receive;