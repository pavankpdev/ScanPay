import { ethers } from "ethers";

export type ChainOptions = {
    rpc: string,
    chainId: number,
    name: string,
    token: string,
    explorer?: string
}

export const defaultChain: ChainOptions = {
    rpc: "https://eth-sepolia.g.alchemy.com/v2/2szX75UdFdHaAe9466h9plA8KiHJueFP",
    chainId: 11155111,
    name: "Sepolia",
    token: 'ETH',
    explorer: 'https://sepolia.etherscan.io'
}
export const createProvider = (chain: ChainOptions = defaultChain ) => {
    return new ethers.providers.JsonRpcProvider(chain.rpc, chain.chainId);
}

export const createSigner = (privateKey: string, chain?: ChainOptions) => {
    const provider = createProvider(chain);
    const wallet = new ethers.Wallet(privateKey, provider);
    return wallet.connect(provider);
}