import {Chip, Text} from 'react-native-paper';
import {StyleSheet, View} from "react-native";
import React from "react";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import {useMutation} from "react-query";
import {verifyPhrase} from "../../helpers/verifyPhrase";
import {createNewWallet} from "../../helpers/createNewWallet";
import {useSecureStorage} from "../../hooks/useSecureStorage";

const Verify = ({navigation}: {navigation: any}) => {
    const [mnemonic, setMnemonic] = React.useState('')

    const {setItem, getItem} = useSecureStorage()

    const {
        isLoading: isVerifyingMnemonic,
        mutate: verifyMnemonicMutation,
    } = useMutation({
        mutationKey: 'verifyMnemonic',
        mutationFn: async () => verifyPhrase(mnemonic),
        onSuccess: async () => {
            const session = await getItem('scanpay_session')
            const sessionData = JSON.parse(session)
            const {data} = await createNewWallet(
                sessionData.seed,
                "Account 1",
                sessionData.password,
                sessionData.email
            )

            const newSession = {
                ...sessionData,
                wallets: [data]
            }

            await setItem('scanpay_session', JSON.stringify(newSession))

            navigation.reset({
                index: 0,
                routes: [{ name: 'Wallet' }],
            })
        }
    })

    return (
        <>
            <View style={styles.container}>
                <View  style={styles.sections}>
                    <Text variant="headlineSmall" style={{fontWeight: '700'}}>Verify your seed phrase</Text>
                    <Text variant="titleSmall" style={{color: "#475569"}}>
                        Please enter the words in the correct order to verify your seed phrase
                    </Text>
                </View>
                <View style={styles.sections}>
                    <TextInput
                        multiline={true}
                        numberOfLines={6}
                        placeholder={"Enter the seed phrase"}
                        description={"Please enter the words in the correct order, add space between each word"}
                        value={mnemonic}
                        onChangeText={(text) => setMnemonic(text)}
                     />
                </View>
                <View  style={styles.sections}>
                    <Button
                        mode="contained"
                        loading={isVerifyingMnemonic}
                        onPress={() => verifyMnemonicMutation()}
                    >
                        Verify
                    </Button>
                </View>
            </View>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 100,
        paddingBottom: 100,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 20,
    },
    sections: {
        width: '100%'
    },
    phrases: {
        backgroundColor: "#f1f5f9",
        borderRadius: 10,
        padding: 20,
        flexWrap: 'wrap',
        flexDirection: 'row',
        gap: 15,
        justifyContent: 'center'
    }
});

export default Verify;