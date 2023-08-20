import {ethers, Wallet} from "ethers";

export const sendERC20Token = (tokenAddress: string, to: string, amount: string, signer: Wallet, tx: any) => {
    const ABI = [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]


    const contract = new ethers.Contract(
        tokenAddress,
        ABI,
        signer
    )

    return contract.transfer(
        to,
        amount
    )
}