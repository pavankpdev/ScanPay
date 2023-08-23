import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import WalletUtilityBtn from "../WalletUtilityBtn";

type QRScannerProps = {
    showScanner: boolean,
    callBack: (data: any) => void,
    setShowScanner: (show: boolean) => void,
}

const ScannerScreen = ({showScanner, callBack, setShowScanner}: QRScannerProps) => {

    const handleBarCodeScanned = ({ data }: any) => {
        // Handle scanned data here
        console.log(data);
        callBack(data);
        setShowScanner(false); // Close the scanner after scanning
    };


    if(!showScanner) return (
        <></>
    )

    return (
        <BarCodeScanner
            style={styles.fullScreen}
            onBarCodeScanned={handleBarCodeScanned}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    fullScreen: {
        width: 1000,
        height: 1000,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute', // Position the scanner overlay
        top: 0,
        right: 1010,
        bottom: 0,
        left: -250,
        zIndex: 9999,
    },
});

export default ScannerScreen;
