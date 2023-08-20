import { ethers } from "ethers";

export type ChainOptions = {
    rpc: string,
    chainId: number,
    name: string,
    token: string,
    explorer?: string
}

export const supportedChains: ChainOptions[] = [
    {
        rpc: "https://eth-sepolia.g.alchemy.com/v2/2szX75UdFdHaAe9466h9plA8KiHJueFP",
        chainId: 11155111,
        name: "Sepolia",
        token: 'ETH',
        explorer: 'https://sepolia.etherscan.io'
    },
    {
        rpc: "https://eth.llamarpc.com",
        chainId: 1,
        name: "Ethereum",
        token: 'ETH',
        explorer: 'https://etherscan.io'
    },
    {
        rpc: "https://polygon-mumbai.g.alchemy.com/v2/e5X5TCL-0GBdm_iP9LnsNskTgeAHPHrS",
        chainId: 80001,
        name: "Mumbai",
        token: 'MATIC',
        explorer: 'https://mumbai.polygonscan.com'
    },
    {
        rpc: "https://polygon.llamarpc.com",
        chainId: 137,
        name: "Polygon",
        token: 'MATIC',
        explorer: 'https://polygonscan.com'
    }
]

export const defaultChain: ChainOptions = supportedChains[0];
export const createProvider = (chain: ChainOptions = defaultChain ) => {
    return new ethers.providers.JsonRpcProvider(chain.rpc, chain.chainId);
}

export const createSigner = (privateKey: string, chain?: ChainOptions) => {
    const provider = createProvider(chain);
    const wallet = new ethers.Wallet(privateKey, provider);
    return wallet.connect(provider);
}