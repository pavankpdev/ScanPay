import {useSecureStorage} from "../../hooks/useSecureStorage";
import {useNetwork} from "../../context/network";
import {useQuery} from "react-query";
import {SelectList} from "react-native-dropdown-select-list/index";

type TokenProps = {
    handleChange: (value: any) => void
}

const TokenSelect = ({handleChange}: TokenProps) => {
    const {getItem} = useSecureStorage()
    const {network} = useNetwork()

    const {data: tokens} = useQuery({
        queryKey: ['tokens'],
        queryFn: async () => {
            const session = await getItem('scanpay_session')
            if(!session) return
            const data = JSON.parse(session)

            if(!data?.tokens) return

            return data
                .tokens
                .filter((t: any) => t.chainId === network?.chainId)
                .map((t: any) => ({
                    key: t?.name,
                    value: t?.name,
                    ...t
                }))
        }
    })

    const onChange = (v: string) => {
        if(v === network?.token) return handleChange({
            name: network?.token,
            symbol: network?.token,
            isNative: true,
        })

        const token = tokens?.find((t: any) => t.name === v)
        handleChange(token)
    }

    return <>
        <SelectList
            setSelected={onChange}
            data={tokens ? [
                {
                    key: network?.token,
                    value: network?.token,
                },
                ...tokens
            ] : [{
                key: network?.token,
                value: network?.token,
            }]}
            placeholder="Select Asset"
        />
    </>
}

export default TokenSelect