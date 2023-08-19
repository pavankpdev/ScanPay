import {useState} from "react";
import {ChainOptions, createProvider, defaultChain} from "../utils/provider";

export const useNetwork = () => {
    const [network, setNetwork] = useState<ChainOptions>(defaultChain);

    const getNativeTokenBalance = async (address: string) => {
        const provider = createProvider(network);
        return provider.getBalance(address);
    }

    return {
        network,
        setNetwork,
        getNativeTokenBalance
    }
}