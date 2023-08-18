import {StyleSheet, Text, View} from "react-native";
import {IconButton} from "react-native-paper";

type WalletUtilityBtnProps = {
    icon: string,
    text: string,
}

const WalletUtilityBtn = ({icon, text}: WalletUtilityBtnProps) => {
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
                onPress={() => console.log('Pressed')}
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