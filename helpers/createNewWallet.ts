import {axios} from "../config/axios";

export const createNewWallet = async (name: string) => {
    const SecureStore = require('expo-secure-store');
    const session = await SecureStore.getItemAsync('scanpay_session');

    if(!session) {
        throw new Error('Session not found');
    }

    return axios({
        url: '/account/new',
        method: 'POST',
        data: {
            ...session,
            name
        }
    })
}