import {Chip, Text} from 'react-native-paper';
import {StyleSheet, View} from "react-native";
import React, {useEffect} from "react";
import Button from "../../components/Button";
import {useSecureStorage} from "../../hooks/useSecureStorage";
import {useMutation, useQuery} from "react-query";

const Display = ({navigation}: {navigation: any}) => {

    const {getItem} = useSecureStorage()

    const {data, isFetching} = useQuery({
        queryFn: async () => {
            const item = await getItem('scanpay_session')
            if (item) {
                return JSON.parse(item)
            }
        },
        queryKey: 'scanpay_session',
    })

    const redirectToVerifyMnemonic = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'VerifyMnemonic' }],
        })
    }

    return (
        <>
            <View style={styles.container}>
                <View  style={styles.sections}>
                    <Text variant="headlineSmall" style={{fontWeight: '700'}}>Secure your wallet</Text>
                    <Text variant="titleSmall" style={{color: "#475569"}}>Here's the seed phrase that's unique to your wallet</Text>
                </View>
                <View style={styles.sections}>
                    <View style={styles.phrases}>
                        {
                            isFetching && <Text>
                                Loading...
                            </Text>
                        }

                        {
                            !isFetching && data?.mnemonic.split(' ').map((word: string, index: number) => {
                                return (
                                    <Chip key={index}>{word}</Chip>
                                )
                            })
                        }
                    </View>
                </View>
                <View  style={styles.sections}>
                    <Text variant="titleSmall"  style={{color: "#475569"}}>
                        Please write down the above seed phrase and keep it safe. You will need it to recover your wallet.
                    </Text>
                    <Button
                        mode="contained"
                        onPress={redirectToVerifyMnemonic}
                    >
                        I've saved it, continue
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

export default Display;