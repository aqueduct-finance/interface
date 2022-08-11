import { useState } from "react";
import { ethers } from "ethers";

import NumberEntryField from "../NumberEntryField";
import WidgetContainer from "../WidgetContainer";
import DAIABI from "../../utils/DAIABI.json";
import AqueductTokenABI from "../../utils/AqueductTokenABI.json";

declare var window: any; // so that we can access ethereum object - TODO: add interface to more gracefully solve this

// const FDAI_ADDRESS = process.env.NEXT_PUBLIC_FDAI_ADDRESS;
const FDAI_ADDRESS = "0x88271d333C72e51516B67f5567c728E702b3eeE8";
const AQUEDUCT_TOKEN0_ADDRESS = "0x6130677802D32e430c72DbFdaf90d6d058137f0F";
// const AQUEDUCT_TOKEN0_ADDRESS = process.env.NEXT_PUBLIC_AQUEDUCT_TOKEN0_ADDRESS;
const AQUEDUCT_TOKEN1_ADDRESS = process.env.NEXT_PUBLIC_AQUEDUCT_TOKEN1_ADDRESS;
const DAI_ABI = DAIABI;
const AQUEDUCT_TOKEN_ABI = AqueductTokenABI.abi;

const UpgradeWidget = () => {
    const [amount, setAmount] = useState("");

    // TODO: Add dropdown for two AQUA tokens (AQUA0 & AQUA1)
    const upgrade = async (amount: string) => {
        try {
            console.log("top of upgrade");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const daiContract = new ethers.Contract(
                FDAI_ADDRESS || "",
                DAI_ABI,
                signer
            );
            console.log("after creating dai contract");
            const aqueductToken = new ethers.Contract(
                AQUEDUCT_TOKEN0_ADDRESS || "",
                AQUEDUCT_TOKEN_ABI,
                signer
            );
            console.log("after aqueduct contract");
            amount = "30000000000000000000"; // 30 DAI
            const approvedTransaction = await daiContract.approve(
                AQUEDUCT_TOKEN0_ADDRESS,
                amount
            );
            await approvedTransaction.wait();
            console.log("spend approved: ", approvedTransaction);

            const upgradedTransaction = await aqueductToken.upgrade(amount);
            await upgradedTransaction.wait();
            console.log("Upgraded tokens: ", upgradedTransaction);
        } catch (error) {
            console.log("Upgrade error: ", error);
        }
    };

    return (
        <section className="flex flex-col items-center w-full text-white">
            <WidgetContainer title="Upgrade">
                <NumberEntryField
                    title="Enter amount to upgrade here"
                    number={amount}
                    setNumber={setAmount}
                />

                <button
                    className="h-14 bg-blue-500 font-bold rounded-2xl hover:outline outline-2 text-white"
                    onClick={() => upgrade(amount)}
                >
                    Upgrade
                </button>
            </WidgetContainer>
        </section>
    );
};

export default UpgradeWidget;
