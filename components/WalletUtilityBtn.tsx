import {StyleSheet, Text, View} from "react-native";
import {Button as PaperButton, IconButton} from "react-native-paper";
import React from "react";

type WalletUtilityBtnProps = {
    icon: string,
    text: string,
    onPress: () => void,
}

const WalletUtilityBtn = ({icon, text, onPress}: WalletUtilityBtnProps) => {
    return <>
        <View
            style={{
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <IconButton
                icon={icon}
                iconColor="#fff"
                size={25}
                onPress={onPress}
                style={{
                    backgroundColor: '#7339ac',
                }}
            />
            <Text>
                {text}
            </Text>
        </View>
    </>
}

export default WalletUtilityBtn