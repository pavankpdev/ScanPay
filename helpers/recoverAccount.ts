import {axios} from "../config/axios";

export const recoverAccount = async (mnemonic: string, email: string) => {
    return axios({
        url: '/seed/recover',
        method: 'POST',
        data: {
            mnemonic,
            email
        }
    })
}