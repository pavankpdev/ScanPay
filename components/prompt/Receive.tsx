import * as React from 'react';
import { Modal, Portal, Text, Snackbar } from 'react-native-paper';
import WalletUtilityBtn from "../WalletUtilityBtn";
import {View, StyleSheet, Image, Share} from "react-native";
import CustomButton from "../Button"
import {useAccount} from "../../context/account";
import {genQR} from "../../utils/genQR";
import axios from "axios";
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

    global.Buffer = require('buffer').Buffer;
    const shareQR = async () => {
        const Sharing = require('expo-sharing');
        const isAvailable = await Sharing.isAvailableAsync();

        if (isAvailable) {
            const FileSystem = require('expo-file-system');
            const config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: genQR(wallet?.address as string),
                responseType: 'arraybuffer',
            };

            try {
                const { data: qrCodeData } = await axios.request(config as any);

                const qrCodePath = `${FileSystem.cacheDirectory}qrcode.png`;

                // Convert binary data to base64 and log for debugging
                const base64Image = Buffer.from(qrCodeData, 'binary').toString('base64');

                // Write the base64 data to the file
                await FileSystem.writeAsStringAsync(qrCodePath, base64Image, {
                    encoding: FileSystem.EncodingType.Base64,
                });


                // Share the image
                await Sharing.shareAsync(qrCodePath, {
                    dialogTitle: 'QR Code to receive crypto',
                    message: 'Check out my QR code for receiving crypto!',
                });

                // Delete the file
                await FileSystem.deleteAsync(qrCodePath);
            } catch (error) {
                console.error('Error while sharing:', error);
            }
        }
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
                            {
                                wallet?.address && (
                                    <>
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
                                    </>
                                )
                            }
                            <CustomButton
                                mode="contained"
                                onPress={shareQR}
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