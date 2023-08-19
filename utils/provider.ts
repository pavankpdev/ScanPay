import { ethers } from "ethers";

export type ChainOptions = {
    rpc: string,
    chainId: number,
    name: string,
    token: string
}

export const defaultChain = {
    rpc: "https://eth-sepolia.g.alchemy.com/v2/demo",
    chainId: 11155111,
    name: "Sepolia",
    token: 'ETH'
}
export const createProvider = (chain: ChainOptions = defaultChain ) => {
    return new ethers.providers.JsonRpcProvider(chain.rpc, chain.chainId);
}

export const createSigner = (privateKey: string, chain?: ChainOptions) => {
    const provider = createProvider(chain);
    const wallet = new ethers.Wallet(privateKey, provider);
    return wallet.connect(provider);
}