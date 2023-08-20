import {ethers, Wallet} from "ethers";
import {createSigner} from "../utils/provider";

export const getTokenName = async (tokenAddress: string, signer: Wallet) => {
    console.log("tokenAddress", tokenAddress)
    const ABI = [
        {
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]

    const contract = new ethers.Contract(
        tokenAddress,
        ABI,
        signer
    )

    return contract.name()

}