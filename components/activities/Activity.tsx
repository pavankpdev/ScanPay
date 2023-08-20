import {StyleSheet, View} from "react-native";
import {Button, Text} from 'react-native-paper';
import { Linking } from 'react-native';
import {useNetwork} from "../../context/network";

type ActivityProps = {
    from: string,
    to: string,
    amount: number,
    hash: string,
}

const Activity = ({from, amount, to, hash}: ActivityProps) => {
    return <>
        <View style={styles.container}>
            <View>
                <Text variant="titleSmall"><Text style={{color: '#7339ac'}}>
                    Form
                </Text>: {`${from.slice(0,5)}...${from.slice(-3)}`}</Text>
                <Text variant="titleSmall"><Text style={{color: '#7339ac'}}>
                    to
                </Text>: {`${to.slice(0,5)}...${to.slice(-3)}`}</Text>
            </View>
            <View>
                <Text variant="titleLarge" style={{fontWeight: '700'}}>{amount.toFixed(2)} ETH</Text>
            </View>
        </View>
    </>
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
    },
});

export default Activity