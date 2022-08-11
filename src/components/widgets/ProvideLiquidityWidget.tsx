import { useState } from "react";
import { ethers } from "ethers";
import { Framework, isEthersProvider, isInjectedWeb3 } from "@superfluid-finance/sdk-core";

import AddressEntryField from "../AddressEntryField";
import NumberEntryField from "../NumberEntryField";
import WidgetContainer from "../WidgetContainer";
import AqueductTokenABI from "../../utils/AqueductTokenABI.json";
import DAIABI from "../../utils/DAIABI.json";
import PoolFactoryABI from "../../utils/PoolFactoryABI.json";


declare var window: any;
const POOL_FACTORY_ADDRESS="0xBC9ca4Ee4775476f21ecFb5a666A2c5B0434393F";
const SUPER_APP_ADDRESS = "0x35aE4f514a374900Ee47c489129C7d98739F9Aeb";
const FDAI_ADDRESS = "0x88271d333C72e51516B67f5567c728E702b3eeE8";
const AQUEDUCT_TOKEN0_ADDRESS = "0x6130677802D32e430c72DbFdaf90d6d058137f0F";
const AQUEDUCT_TOKEN1_ADDRESS = "0x9103E14E3AaF4E136BFe6AF1Bf2Aeff8fc5b99b9";
const DAI_ABI = DAIABI;
const AQUEDUCT_TOKEN_ABI = AqueductTokenABI.abi;
const POOL_FACTORY_ABI = PoolFactoryABI.abi;
const ProvideLiquidityWidget = () => {
    const [amount0, setAmount0] = useState("");
    const [amount1, setAmount1] = useState("");
    const [address, setAddress] = useState("");
    const [swapFlowRate, set] = useState("");
    // Connect Web3 and get accounts
    const connect = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const { chainId } = await provider.getNetwork();
        const signer = provider.getSigner();
        console.log("ChainId is: ", chainId);
        console.log(window.web3.currentChainId);
        const accounts = await provider.listAccounts();
        const balanceBigNum = await provider.getBalance(accounts[0]);
        const balance = ethers.utils.formatEther(balanceBigNum.toString());
        console.log('balance is: ', balance);

        // Create the Pool Factory contract object to interact with
        const poolFactoryContract = new ethers.Contract(
            POOL_FACTORY_ADDRESS || "",
            POOL_FACTORY_ABI,
            signer
        );
        console.log("pool factory contract: ", poolFactoryContract);
        const created_pool = await poolFactoryContract.createPool(AQUEDUCT_TOKEN0_ADDRESS, AQUEDUCT_TOKEN1_ADDRESS, amount0, amount0);
        
        console.log("created pool: ", created_pool);
        // Now start streams with each of the pool
        try{
            // Start stream to pool with Token A
            const superfluid_contract = await Framework.create({
                chainId: Number(chainId),
                provider: provider,
            })

            const createFlowOperation0 = superfluid_contract.cfaV1.createFlow({
                receiver: created_pool,
                flowRate: "300",
                superToken: AQUEDUCT_TOKEN0_ADDRESS || "",
            })
            const result0 = await createFlowOperation0.exec(signer);
            await result0.wait();
            console.log("Stream 0 created: ", result0);
            // Start stream to pool with Token B
            const createFlowOperation1 = superfluid_contract.cfaV1.createFlow({
                receiver: created_pool,
                flowRate: "300",
                superToken: AQUEDUCT_TOKEN1_ADDRESS || "",
            })
            const result1 = await createFlowOperation1.exec(signer);
            await result1.wait();
            console.log("Stream 1 created: ", result1);
            // Start stream to pool with Token B
        } catch (error) {
            console.log("Error streaming to pool: ", error);
        }

        // TESTING 
        // Looking to get all the token balance in a users wallet to see if they are able to provide liqudity
        //  before trying to create a stream resulting in an error
        // Create a read only contract to view the balance of all token

        // const tokenAddresses = [FDAI_ADDRESS, AQUEDUCT_TOKEN0_ADDRESS, AQUEDUCT_TOKEN1_ADDRESS];
        // var i = 0;
        // for (let tokenAddress of tokenAddresses) {
        //     if(i == 0){
        //         console.log("fucked up token addy: ", tokenAddress);
        //         // const contract = new ethers.Contract(DAI_ABI.toString(), tokenAddress);
        //         // const tokenBalance = await contract.methods.balanceOf(address).call();
        //     }
        //     else{
        //         console.log("fucked up token addy: ", tokenAddress);
        //         const contract = new ethers.Contract(AQUEDUCT_TOKEN_ABI.toString(), tokenAddress);
        //         const tokenBalance = await contract.methods.balanceOf(address).call();
        //     }
        //     i += 1;
        // }
    }
    return (
        <section className="flex flex-col items-center w-full">
            <WidgetContainer title="Provide Liquidity">
            <section className="flex flex-col items-center w-full">
                <WidgetContainer title="Aqua0">
                <NumberEntryField
                    title="Enter amount to provide here"
                    number={amount0}
                    setNumber={setAmount0}
                />
                </WidgetContainer>
            </section>
            <section className="flex flex-col items-center w-full">
                <WidgetContainer title="Aqua1">
                <NumberEntryField
                    title="Enter amount to provide here"
                    number={amount0}
                    setNumber={setAmount0}
                />
                </WidgetContainer>
            </section>
            <button className = "h-14 bg-blue-500 font-bold rounded-2xl hover:outline outline-2 text-white"
            onClick={() => connect()}
            >
                Add New Position
            </button>
            </WidgetContainer>
            
        </section>
    )
        

}

export default ProvideLiquidityWidget;