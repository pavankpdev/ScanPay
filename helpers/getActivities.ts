import axios from 'axios';
export const getActivities = async (address: string, chainId: number) => {
    const url = `https://deep-index.moralis.io/api/v2/${address}?chain=0x${chainId.toString(16)}&limit=10`
    return axios({
        method: 'GET',
        url,
        headers: {
            'X-API-Key': 'pFOQtGZ1eKSL6StZDD8BpUGaJxR8koghl8vdDlYJymMqXCtD0BwKzblCEUP4Q6SW'
        }
    })
}