import React, {useState} from "react";
import {ChainOptions, createProvider, defaultChain} from "../utils/provider";
import {useQuery} from "react-query";
import {useAccount} from "./account";
import {BigNumber} from "ethers";

const Network = React.createContext({
    network: defaultChain,
    setNetwork: (network: ChainOptions) => {},
    balance: "0" as any,
    isFetchingBalance: false,
    isFetchingEstimatedGas: false,
    estimatedGas: '0' as any
})

export const NetworkProvider: React.FC<React.PropsWithChildren> = ({children}) => {

    const [network, setNetwork] = useState<ChainOptions>(defaultChain);

    const {wallet} = useAccount()

    const {data: balance, isFetching: isFetchingBalance} = useQuery({
        queryFn: async () => {
            const provider = createProvider(network);
            return provider.getBalance(wallet?.address as string)
        },
        enabled: !!wallet?.address && !!network?.chainId,
        queryKey: ['getNativeTokenBalance', wallet?.address, network?.chainId],
    })

    console.log('balance', BigNumber.from(balance || "0").toString())

    const {data: estimatedGas, isFetching: isFetchingEstimatedGas} = useQuery({
        queryFn: async () => {
            const provider = createProvider(network);
            return provider.getGasPrice()
        },
        enabled:  !!network?.chainId,
        queryKey: ['estimatedGas', network],
    })


    return <Network.Provider value={{
        balance,
        isFetchingBalance,
        estimatedGas,
        isFetchingEstimatedGas,
        network,
        setNetwork
    }}>
        {children}
    </Network.Provider>
}

export const useNetwork = () => React.useContext(Network)