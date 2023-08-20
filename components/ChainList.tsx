import * as React from 'react';
import { Modal, Portal, Text, Button, PaperProvider, Avatar } from 'react-native-paper';
import Icon from "react-native-vector-icons/Entypo";
import {StyleSheet, Touchable, TouchableOpacity, View} from "react-native";
import {useNetwork} from "../context/network";
import {supportedChains} from "../utils/provider";
import FAIcon from "react-native-vector-icons/FontAwesome"

const ChainList = () => {
    const [visible, setVisible] = React.useState(false);

    const {network, setNetwork} = useNetwork()
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
        gap: 10
    };

    return (
        <>
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={hideModal}
                    contentContainerStyle={containerStyle}
                >
                    <Text variant="titleLarge" style={{fontWeight: '700', color: '#7339ac'}}>Switch Chains</Text>
                    <Text variant="titleSmall" style={{fontWeight: '600', marginTop: -10}}>Select any of the supported chain below</Text>
                    <View style={{marginTop: 20}}>
                        {
                            supportedChains.map((chain, index) => {

                                const isSelected = chain?.chainId === network?.chainId

                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setNetwork(chain)
                                            hideModal()
                                        }}
                                    >
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: 10,
                                            borderRadius: 10,
                                            borderWidth: 1,
                                            borderColor: '#3730a3',
                                            marginBottom: 10
                                        }}>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    gap: 10,
                                                }}
                                            >
                                                <Avatar.Text size={24} label={chain?.name[0]} />
                                                <Text>
                                                    {chain?.name} ({chain?.token})
                                                </Text>
                                            </View>
                                            {
                                                isSelected && (
                                                    <FAIcon name="check" size={20} color="#3730a3" />
                                                )
                                            }
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </Modal>
            </Portal>
            <TouchableOpacity
                onPress={showModal}
            >
                <View
                    style={styles.networkList}
                >
                    <Avatar.Text size={24} label={network?.name[0]} />
                    <Text style={{color: '#fff'}}>{network?.name}</Text>
                    <Icon name="chevron-down" size={20} color="#fff" />
                </View>
            </TouchableOpacity>
        </>
    );
};
const styles = StyleSheet.create({
    networkList: {
        backgroundColor: '#1e1b4b',
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 10,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#3730a3',
        gap: 10,
        alignItems: 'center',
    },
});
export default ChainList;