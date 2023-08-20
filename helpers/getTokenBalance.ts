import {ethers, Wallet} from "ethers";
import {createSigner} from "../utils/provider";

export const getTokenBalance = async (tokenAddress: string, signer: Wallet) => {
    const ABI = [
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "name": "balance",
                    "type": "uint256"
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

    const _owner = await signer.getAddress()

    return contract.balanceOf(_owner)
}