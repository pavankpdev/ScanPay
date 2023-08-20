import {StyleSheet, View} from "react-native";
import { Avatar } from 'react-native-paper';
import { Text } from 'react-native-paper';
import {useQuery} from "react-query";
import {createSigner} from "../utils/provider";
import {useSecureStorage} from "../hooks/useSecureStorage";
import {useAccount} from "../context/account";
import {useNetwork} from "../context/network";
import {getTokenBalance} from "../helpers/getTokenBalance";
import {BigNumber, ethers} from "ethers";

type TokenProps = {
    name: string,
    symbol: string,
    address: string,
}

const Token = ({name, symbol, address}: TokenProps) => {

    const {getItem} = useSecureStorage()
    const {wallet} = useAccount()
    const {network} = useNetwork()

    const {data: balance} = useQuery({
        queryFn: async () => {
            const session = await getItem('scanpay_session');

            const selectedWallet = JSON.parse(session).wallets.find((w: any) => w.address === wallet?.address);
            const signer = createSigner(selectedWallet.privateKey, network);

            return getTokenBalance(address, signer)
        }
    })

    return (
        <View style={styles.container}>
            <Avatar.Text size={40} label={name.slice(0, 2)} />
            <View style={styles.details}>
                <Text variant="titleMedium">{name}</Text>
                <Text variant="titleSmall">{
                    balance ? parseFloat(ethers.utils.formatEther(BigNumber.from(balance).toString())).toFixed(2) : 0
                } ${symbol}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        padding: 10
    },
    details: {
        flexDirection: 'column',
    }
});


export default Token