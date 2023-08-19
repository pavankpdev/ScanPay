import {useQuery} from "react-query";
import {getActivities} from "../../helpers/getActivities";
import {useAccount} from "../../context/account";
import {useNetwork} from "../../context/network";
import Activity from "./Activity";
import {ethers} from "ethers";

export const Activities = () => {

    const {wallet} = useAccount()
    const {network} = useNetwork()

    const {data: activities, error, isFetching} = useQuery({
        queryFn: async () => getActivities(wallet?.address as string, network?.chainId),
        queryKey: ['getActivities', wallet?.address, network?.chainId],
        enabled: !!wallet && !!network
    })

    return <>
        {
            activities && activities?.data?.result?.map((activity: any) => {
                return <Activity
                    key={activity?.nonce}
                    from={activity?.from_address}
                    to={activity?.to_address}
                    amount={activity?.value ?
                        parseFloat(ethers?.utils.formatEther(activity?.value || "0")) : 0}
                    hash={activity?.hash}
                />
            })
        }
    </>
}

export default Activities