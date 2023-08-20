import {ethers, Wallet} from "ethers";
import {createSigner} from "../utils/provider";

export const getTokenSymbol = async (tokenAddress: string, signer: Wallet) => {
    const ABI = [
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
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

    return contract.symbol()
}