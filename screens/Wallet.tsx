import {useSecureStorage} from "../hooks/useSecureStorage";
import {useEffect} from "react";
import {View,Text} from "react-native";

const Wallet = ({navigation}: {navigation: any}) => {

    const {getItem} = useSecureStorage()

    useEffect(() => {
        getItem('scanpay_session').then((value) => {
            if (!value) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Auth' }],
                })
            }
            console.log(value)
        })
    }, []);

    return (
        <View>
            <Text>Wallet</Text>
        </View>
    )
}

export default Wallet