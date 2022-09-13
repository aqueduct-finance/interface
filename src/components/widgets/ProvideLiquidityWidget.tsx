import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import { useNetwork, useProvider, useSigner } from "wagmi";

import NumberEntryField from "../NumberEntryField";
import WidgetContainer from "./WidgetContainer";
import ToastType from "../../types/ToastType";
import LoadingSpinner from "../LoadingSpinner";
import getPoolAddress from "../../helpers/getPool";
import { useStore } from "../../store";
import TokenDropdown from "../TokenDropdown";
import PricingField from "../PricingField";

interface ProvideLiquidityWidgetProps {
    showToast: (type: ToastType) => {};
}

const ProvideLiquidityWidget = ({ showToast }: ProvideLiquidityWidgetProps) => {
    const store = useStore();
    const provider = useProvider();
    const { data: rainbowSigner } = useSigner();
    const signer = rainbowSigner as ethers.Signer;
    const { chain } = useNetwork();

    const [flowRate0, setFlowRate0] = useState("");
    const [flowRate1, setFlowRate1] = useState("");
    const [loading, setLoading] = useState(false);
    const [token1Price, setToken1Price] = useState(0);
    const [refreshingPrice, setRefreshingPrice] = useState(false);
    const [poolExists, setPoolExists] = useState(true);

    const swap = async () => {
        try {
            setLoading(true);

            const formattedFlowRate0: BigNumber = ethers.utils.parseUnits(
                flowRate0,
                "ether"
            );
            const formattedFlowRate1: BigNumber = ethers.utils.parseUnits(
                flowRate1,
                "ether"
            );

            if (signer == null || signer == undefined) {
                showToast(ToastType.ConnectWallet);
                setLoading(false);
                return;
            }

            const chainId = chain?.id;
            const superfluid = await Framework.create({
                chainId: Number(chainId),
                provider: provider,
            });

            const pool = getPoolAddress(
                store.inboundToken.value,
                store.outboundToken.value
            );

            const token0 = store.outboundToken.address;
            const token1 = store.inboundToken.address;

            if (token0 && token1 && pool) {
                const createFlowOperation0 = superfluid.cfaV1.createFlow({
                    receiver: pool,
                    flowRate: formattedFlowRate0.toString(),
                    superToken: token0,
                });
                const createFlowOperation1 = superfluid.cfaV1.createFlow({
                    receiver: pool,
                    flowRate: formattedFlowRate1.toString(),
                    superToken: token1,
                });
                const batchCall = superfluid.batchCall([
                    createFlowOperation0,
                    createFlowOperation1,
                ]);
                const result = await batchCall.exec(signer);
                await result.wait();

                console.log("Streams created: ", result);
                showToast(ToastType.Success);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error: ", error);
            showToast(ToastType.Error);
            setLoading(false);
        }
    };

    // refresh spot pricing upon user input
    useEffect(() => {
        const refreshPrice = async () => {
            setRefreshingPrice(true);

            const token0Address = store.outboundToken.address;
            const token1Address = store.inboundToken.address;

            const poolABI = [
                "function getFlowIn(address token) external view returns (uint128 flowIn)",
            ];

            try {
                const poolAddress = getPoolAddress(
                    store.inboundToken.value,
                    store.outboundToken.value
                );
                setPoolExists(true);
                const poolContract = new ethers.Contract(
                    poolAddress,
                    poolABI,
                    provider
                );

                // get flows
                var token0Flow: BigNumber = await poolContract.getFlowIn(
                    token0Address
                );
                var token1Flow: BigNumber = await poolContract.getFlowIn(
                    token1Address
                );

                // calculate new flows
                if (flowRate0 != "") {
                    const formattedFlowRate0: BigNumber =
                        ethers.utils.parseUnits(flowRate0, "ether");
                    token0Flow = token0Flow.add(formattedFlowRate0);
                }
                if (flowRate1 != "") {
                    const formattedFlowRate1: BigNumber =
                        ethers.utils.parseUnits(flowRate1, "ether");
                    token1Flow = token1Flow.add(formattedFlowRate1);
                }

                // calculate price multiple
                if (token0Flow.gt(0)) {
                    setToken1Price(
                        token1Flow.mul(100000).div(token0Flow).toNumber() /
                            100000
                    );
                } else {
                    setToken1Price(0);
                }

                await new Promise((res) => setTimeout(res, 900));
                setRefreshingPrice(false);
            } catch (err) {
                console.log(err);
                setRefreshingPrice(false);
                setPoolExists(false);
            }
        };

        refreshPrice();
    }, [flowRate0, flowRate1, store.inboundToken, store.outboundToken]);

    return (
        <section className="flex flex-col items-center w-full">
            <WidgetContainer title="Provide Liquidity">
                <div className="space-y-3">
                    <TokenDropdown
                        selectTokenOption={store.outboundToken}
                        setToken={store.setOutboundToken}
                    />
                    <NumberEntryField
                        title="FlowRate ( ether / sec )"
                        number={flowRate0}
                        setNumber={setFlowRate0}
                    />
                </div>
                <div className="space-y-3">
                    <TokenDropdown
                        selectTokenOption={store.inboundToken}
                        setToken={store.setInboundToken}
                    />
                    <NumberEntryField
                        title="FlowRate ( ether / sec )"
                        number={flowRate1}
                        setNumber={setFlowRate1}
                    />
                </div>
                <PricingField
                    refreshingPrice={refreshingPrice}
                    token1Price={token1Price}
                    poolExists={poolExists}
                />

                {loading ? (
                    <div className="flex justify-center items-center h-14 bg-aqueductBlue/90 text-white rounded-2xl outline-2">
                        <LoadingSpinner size={30} />
                    </div>
                ) : (
                    <button
                        className="h-14 bg-aqueductBlue/90 text-white font-bold rounded-2xl hover:outline outline-2"
                        onClick={() => swap()}
                    >
                        Provide Liquidity
                    </button>
                )}
            </WidgetContainer>
        </section>
    );
};

export default ProvideLiquidityWidget;
