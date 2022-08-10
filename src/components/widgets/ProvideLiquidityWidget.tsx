import { useState } from "react";
import { ethers } from "ethers";
import { Framework, isInjectedWeb3 } from "@superfluid-finance/sdk-core";

import AddressEntryField from "../AddressEntryField";
import NumberEntryField from "../NumberEntryField";
import WidgetContainer from "../WidgetContainer";

declare var window: any;
const SUPER_APP_ADDRESS = "0x35aE4f514a374900Ee47c489129C7d98739F9Aeb";
const AQUEDUCT_TOKEN0_ADDRESS = "0x6130677802D32e430c72DbFdaf90d6d058137f0F";
const AQUEDUCT_TOKEN1_ADDRESS = "0x9103E14E3AaF4E136BFe6AF1Bf2Aeff8fc5b99b9";

const ProvideLiquidityWidget = () => {
    const [address, setAddress] = useState("");
    const [swapFlowRate, set] = useState("");
    // Connect Web3 and get accounts
    const connect = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const { chainId } = await provider.getNetwork();
        console.log("ChainId is: ", chainId);
        console.log(window.web3.currentChainId);
        const accounts = await provider.listAccounts();
        const balanceBigNum = await provider.getBalance(accounts[0]);
        const balance = ethers.utils.formatEther(balanceBigNum.toString());
        console.log('balance is: ', balance);
        // Create a read only contract to view the balance of all tokens

        // const tokenAddresses = [AQUEDUCT_TOKEN0_ADDRESS, AQUEDUCT_TOKEN1_ADDRESS];
        // for (let tokenAddress of tokenAddresses) {
        //     const contract = new ethers.Contract(erc20AbiJson, tokenAddress);
        //     const tokenBalance = await contract.methods.balanceOf(myAddress).call();
        // }
    }
    return (
        <div>
            <button
            onClick={() => connect()}
            >
                start of provide liquidity
            </button>
        </div>
    )
        

}

export default ProvideLiquidityWidget;