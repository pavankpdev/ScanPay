import React from "react";

type Wallet = {name: string, address: string}

const Account = React.createContext({
    wallet: {} as Wallet | null,
    setWallet: (wallet: Wallet) => {}
})

export const AccountProvider: React.FC<React.PropsWithChildren> = ({children}) => {

    const [wallet, setWallet] = React.useState<Wallet | null>(null)


    return <Account.Provider value={{
            wallet,
            setWallet
        }}>
            {children}
        </Account.Provider>
}

export const useAccount = () => React.useContext(Account)