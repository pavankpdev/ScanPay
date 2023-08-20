import {useQuery} from "react-query";
import {useSecureStorage} from "../../hooks/useSecureStorage";
import Token from "../Token";
import {Divider} from "react-native-paper";
import {useNetwork} from "../../context/network";

const Tokens = () => {

    const {getItem} = useSecureStorage()
    const {network} = useNetwork()

    const {data: tokens} = useQuery({
        queryKey: ['tokens'],
        queryFn: async () => {
            const session = await getItem('scanpay_session')
            if(!session) return
            const data = JSON.parse(session)

            if(!data?.tokens) return

            return data.tokens
        }
    })

    return <>

        {
            tokens && tokens.map((token: any) => {
                if(token?.chainId !== network?.chainId) return null
                return <>
                    <Token
                        key={token.address}
                        address={token.address}
                        name={token.name}
                        symbol={token.symbol}
                    />
                    <Divider />
                </>
            })
        }

    </>
}

export default Tokens