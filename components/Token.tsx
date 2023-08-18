import {StyleSheet, View} from "react-native";
import { Avatar } from 'react-native-paper';
import { Text } from 'react-native-paper';

type TokenProps = {
    name: string,
    balance: number,
    symbol: string,
}

const Token = ({name, balance, symbol}: TokenProps) => {
    return (
        <View style={styles.container}>
            <Avatar.Text size={40} label={name.slice(0, 2)} />
            <View style={styles.details}>
                <Text variant="titleMedium">{name}</Text>
                <Text variant="titleSmall">{balance} ${symbol}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    details: {
        flexDirection: 'column',
    }
});


export default Token