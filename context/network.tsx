import React, {useState} from "react";
import {ChainOptions, createProvider, defaultChain} from "../utils/provider";

const Network = React.createContext({
    getNativeTokenBalance: (address: string) => {},
    network: defaultChain,
    setNetwork: (network: ChainOptions) => {}
})

export const NetworkProvider: React.FC<React.PropsWithChildren> = ({children}) => {

    const [network, setNetwork] = useState<ChainOptions>(defaultChain);

    const getNativeTokenBalance = async (address: string) => {
        const provider = createProvider(network);
        return provider.getBalance(address);
    }

    return <Network.Provider value={{
        getNativeTokenBalance,
        network,
        setNetwork
    }}>
        {children}
    </Network.Provider>
}

export const useNetwork = () => React.useContext(Network)