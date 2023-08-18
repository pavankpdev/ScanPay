import {axios} from "../config/axios";

export const generateNewSeed = async (password: string, email: string) => {
    return axios({
        url: '/seed/generate',
        method: 'POST',
        data: {
            password,
            email
        }
    })
}