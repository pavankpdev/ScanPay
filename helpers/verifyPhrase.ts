import SecureStore from "expo-secure-store";
import {axios} from "../config/axios";

export const verifyPhrase = async (mnemonic: string) => {
    const SecureStore = require('expo-secure-store');
    const session = await SecureStore.getItemAsync('scanpay_session');

    if(!session) {
        throw new Error('Session not found');
    }

    const data = JSON.parse(session);

    return axios.post(
        '/seed/verify',
        {
            ...data,
            mnemonic
        }
    )

}