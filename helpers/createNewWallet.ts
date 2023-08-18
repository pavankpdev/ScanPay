import {axios} from "../config/axios";

export const createNewWallet = async (
    seed: string,
    name: string,
    password: string,
    email: string,
) => {
    return axios({
        url: '/account/new',
        method: 'POST',
        data: {
            seed,
            name,
            password,
            email
        }
    })
}