/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable radix */
import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { IoArrowBack, IoLogoTwitter } from "react-icons/io5";
import { BiLink } from "react-icons/bi";
import { RiCloseCircleFill, RiPencilFill } from "react-icons/ri";
import { BigNumber, ethers } from "ethers";
import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";
import { Framework } from "@superfluid-finance/sdk-core";
import Operation from "@superfluid-finance/sdk-core/dist/module/Operation";
import { TokenOption } from "../../../../../types/TokenOption";
import getPoolAddress from "../../../../../helpers/getPool";
import WidgetContainer from "../../../../../components/widgets/WidgetContainer";
import PageNotFound from "../../../../../components/PageNotFound";
import getTweetTemplate from "../../../../../utils/getTweetTemplate";
import getSharedLink from "../../../../../utils/getSharedLink";
import { useStore } from "../../../../../store";
import ButtonWithInfoPopup from "../../../../../components/ButtonInfoPopup";
import getToken from "../../../../../utils/getToken";
import ToastType from "../../../../../types/ToastType";
import LoadingSpinner from "../../../../../components/LoadingSpinner";
import getToastErrorType from "../../../../../utils/getToastErrorType";
import SwapData from "../../../../../types/SwapData";

const ANIMATION_MINIMUM_STEP_TIME = 10;
const REFRESH_INTERVAL = 3000; // 300 * 100 = 30000 ms = 30 s

interface BalanceFieldProps {
    currentBalance: BigNumber;
    isTwap: boolean;
    token: TokenOption;
    numDecimals: number;
    isLoading: boolean;
}

interface PriceWidgetProps {
    isLoading: boolean;
    title: string;
    token0: TokenOption;
    token1: TokenOption;
    price: number;
}

interface RewardWidgetProps {
    isLoading: boolean;
    // eslint-disable-next-line react/require-default-props
    title?: string;
    token0: TokenOption;
    token1: TokenOption;
    reward0: BigNumber;
    reward1: BigNumber;
    numDecimals0: number;
    numDecimals1: number;
}

const BalanceField = ({
    currentBalance,
    isTwap,
    token,
    numDecimals,
    isLoading,
}: BalanceFieldProps) => {
    if (isLoading) {
        return (
            <div className="bg-gray-200 dark:bg-gray-800 h-10 rounded-2xl animate-pulse" />
        );
    }

    return (
        <div
            className={`flex space-x-4 items-end rounded-2xl tracking-wider monospace-font font-bold ${
                // + (isTwap ? ('bg-[' + token.colorHex + '30] text-[' + token.colorHex + ']') : 'text-gray-300 text-5xl')
                isTwap
                    ? "text-gray-800 dark:text-white/90 text-3xl md:text-4xl lg:text-5xl xl:text-7xl"
                    : "text-gray-300 dark:text-slate-500/80 text-xl md:text-2xl lg:text-3xl xl:text-5xl font-semibold"
                }`}
        >
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img
                src={token.logo}
                className={isTwap ? "h-12 mb-3 hidden" : "h-12 hidden"}
            />
            <p>
                {(isTwap ? "+" : "-") +
                    parseFloat(
                        ethers.utils.formatEther(currentBalance)
                    ).toLocaleString(undefined, {
                        minimumFractionDigits: numDecimals,
                    })}
            </p>
            <div className="flex space-x-1 md:space-x-2">
                {/* TODO: translate responsive width to be used with Image */}
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img src={token.logo} className="h-4 md:h-6 xl:h-7 xl:mb-2" />
                <p
                    className="text-sm md:text-lg xl:text-2xl poppins-font font-bold tracking-normal"
                    style={{ color: token.colorHex }}
                >
                    {token.label}
                </p>
            </div>
        </div>
    );
};

// TODO: linting errors
const PriceWidget = ({
    isLoading,
    title,
    token0,
    token1,
    price,
}: PriceWidgetProps) => (
    <WidgetContainer smallTitle={title} isUnbounded>
        {isLoading ? (
            <div className="space-y-2">
                <div className="bg-gray-200 dark:bg-gray-800 h-10 w-1/2 rounded-2xl animate-pulse" />
                <div className="bg-gray-200 dark:bg-gray-800 h-10 w-4/5 rounded-2xl animate-pulse" />
            </div>
        ) : (
            <div className="px-4 space-y-2">
                <div className="flex items-end space-x-2">
                    <p className="text-2xl md:text-3xl lg:text-4xl font-bold monospace-font text-gray-800 dark:text-white">
                        1
                    </p>
                    <p className="text-xl md:text-2xl font-bold">
                        {token0.label}
                    </p>
                </div>
                <div className="flex items-end space-x-2">
                    <p className="text-2xl md:text-3xl lg:text-4xl font-bold monospace-font text-gray-800 dark:text-white">
                        {`= ${price}`}
                    </p>
                    <p className="text-xl md:text-2xl font-bold">
                        {token1.label}
                    </p>
                </div>
            </div>
        )}
    </WidgetContainer>
);

const RewardWidget = ({
    isLoading,
    title,
    token0,
    token1,
    reward0,
    reward1,
    numDecimals0,
    numDecimals1,
}: RewardWidgetProps) => (
    <WidgetContainer smallTitle={title} isUnbounded>
        {isLoading ? (
            <div className="space-y-2">
                <div className="bg-gray-200 dark:bg-gray-800 h-10 w-1/2 rounded-2xl animate-pulse" />
                <div className="bg-gray-200 dark:bg-gray-800 h-10 w-4/5 rounded-2xl animate-pulse" />
            </div>
        ) : (
            <div className="space-y-2">
                {reward0.gt(0) && (
                    <BalanceField
                        currentBalance={reward0}
                        isTwap
                        token={token0}
                        numDecimals={numDecimals0}
                        isLoading={isLoading}
                    />
                )}
                {reward1.gt(0) && (
                    <BalanceField
                        currentBalance={reward1}
                        isTwap
                        token={token1}
                        numDecimals={numDecimals1}
                        isLoading={isLoading}
                    />
                )}
            </div>
        )}
    </WidgetContainer>
);

interface PoolInteractionVisualizationProps {
    showToast: (type: ToastType) => {};
}

const PoolInteractionVisualization: NextPage<
    PoolInteractionVisualizationProps
> = ({ showToast }) => {
    // zustand
    const store = useStore();

    // wagmi
    const provider = useProvider();
    const { chain } = useNetwork(); // TODO: use router param
    const { address } = useAccount();
    const { data: rainbowSigner } = useSigner();
    const signer = rainbowSigner as ethers.Signer;

    const [isDeleting, setIsDeleting] = useState(false);

    // component state
    const [isLoading, setIsLoading] = useState(true);
    const [positionFound, setPositionFound] = useState(false);

    // state for token0
    const [currentBalance0, setCurrentBalance0] = useState<BigNumber>(
        ethers.BigNumber.from(0)
    );
    const [flowRate0, setFlowRate0] = useState<BigNumber>(
        ethers.BigNumber.from(0)
    );
    const [currentTwapBalance0, setCurrentTwapBalance0] = useState<BigNumber>(
        ethers.BigNumber.from(0)
    );
    const [twapFlowRate0, setTwapFlowRate0] = useState<BigNumber>(
        ethers.BigNumber.from(0)
    );
    const [currentRewardBalance0, setCurrentRewardBalance0] =
        useState<BigNumber>(ethers.BigNumber.from(0));
    const [rewardFlowRate0, setRewardFlowRate0] = useState<BigNumber>(
        ethers.BigNumber.from(0)
    );
    const [isTwap0, setIsTwap0] = useState<boolean>(false);

    // state for token1
    const [currentBalance1, setCurrentBalance1] = useState<BigNumber>(
        ethers.BigNumber.from(0)
    );
    const [flowRate1, setFlowRate1] = useState<BigNumber>(
        ethers.BigNumber.from(0)
    );
    const [currentTwapBalance1, setCurrentTwapBalance1] = useState<BigNumber>(
        ethers.BigNumber.from(0)
    );
    const [twapFlowRate1, setTwapFlowRate1] = useState<BigNumber>(
        ethers.BigNumber.from(0)
    );
    const [currentRewardBalance1, setCurrentRewardBalance1] =
        useState<BigNumber>(ethers.BigNumber.from(0));
    const [rewardFlowRate1, setRewardFlowRate1] = useState<BigNumber>(
        ethers.BigNumber.from(0)
    );
    const [isTwap1, setIsTwap1] = useState<boolean>(false);

    // current and average price
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [averagePrice, setAveragePrice] = useState<number>(0);

    // extra metadata
    const [startDate, setStartDate] = useState<Date>();

    // url params
    const router = useRouter();
    const [userAddress, setUserAddress] = useState<string>();
    const [token0, setToken0] = useState<TokenOption>();
    const [token1, setToken1] = useState<TokenOption>();
    useEffect(() => {
        if (
            typeof router.query.address !== "string" ||
            typeof router.query.tokenA !== "string" ||
            typeof router.query.tokenB !== "string"
        ) {
            setPositionFound(false);
            setIsLoading(false);
            return;
        }

        // get user wallet address
        setUserAddress(router.query.address);

        async function getTokens() {
            if (
                typeof router.query.tokenA === "string" &&
                typeof router.query.tokenB === "string"
            ) {
                const tokenA = await getToken({
                    tokenAddress: router.query.tokenA,
                    provider,
                    chainId: Number(chain?.id),
                });
                const tokenB = await getToken({
                    tokenAddress: router.query.tokenB,
                    provider,
                    chainId: Number(chain?.id),
                });

                if (!tokenA || !tokenB) {
                    setPositionFound(false);
                    setIsLoading(false);
                    return;
                }
                setToken0(tokenA);
                setToken1(tokenB);
            }
        }

        getTokens();
        // TODO: Assess missing dependency array values
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query]);

    // Refresh function called on interval
    async function refresh() {
        const poolABI = [
            "function getUserSwapData(address token, address account, uint256 time) external view returns (uint256 initialCumulative, uint256 realTimeCumulative, uint128 units)",
            "function getUserRewardData(address token, address account, uint256 time) external view returns (uint256 initialCumulative, uint256 realTimeCumulative, uint128 units)",
        ];
        if (!userAddress || !chain || !provider || !token0 || !token1) {
            return;
        }

        const chainId = chain?.id;
        const sf = await Framework.create({
            chainId: Number(chainId),
            provider,
        });
        const poolAddress = getPoolAddress(token0.value, token1.value);
        const poolContract = new ethers.Contract(
            poolAddress,
            poolABI,
            provider
        );
        const currentTimestampBigNumber = ethers.BigNumber.from(
            new Date().valueOf() // Milliseconds elapsed since UTC epoch, disregards timezone.
        );

        async function getTokenProps({
            tokenAddress,
        }: {
            tokenAddress: string;
        }): Promise<{
            initialBalance: BigNumber;
            initialTwapBalance: BigNumber;
            initialRewardBalance: BigNumber;
            flowRate: BigNumber;
            twapFlowRate: BigNumber;
            rewardFlowRate: BigNumber;
            startDate: Date;
        }> {
            // get regular sf stream params
            const flowInfo = await sf.cfaV1.getFlow({
                superToken: tokenAddress,
                sender: userAddress || "",
                receiver: poolAddress,
                providerOrSigner: provider,
            });

            // calculate regular streaming balances
            let initialBalance: BigNumber = BigNumber.from(0);
            let futureBalance: BigNumber = BigNumber.from(0);
            if (BigNumber.from(flowInfo.flowRate).gt(0)) {
                // use regular sf stream params
                initialBalance = BigNumber.from(flowInfo.flowRate).mul(
                    currentTimestampBigNumber
                        .sub(
                            ethers.BigNumber.from(flowInfo.timestamp.valueOf())
                        )
                        .div(1000)
                );
                futureBalance = BigNumber.from(flowInfo.flowRate).mul(
                    currentTimestampBigNumber
                        .sub(
                            ethers.BigNumber.from(flowInfo.timestamp.valueOf())
                        )
                        .div(1000)
                        .add(
                            (REFRESH_INTERVAL * ANIMATION_MINIMUM_STEP_TIME) /
                            1000
                        )
                );
            }

            // new consts
            const decodeConst = BigNumber.from(2).pow(128);
            const futureTimestampBigNumber: BigNumber =
                currentTimestampBigNumber
                    .div(1000)
                    .add(
                        (REFRESH_INTERVAL *
                            ANIMATION_MINIMUM_STEP_TIME) /
                        1000
                    );

            // calculate twap balances
            const swapData: SwapData = await poolContract.getUserSwapData(tokenAddress, userAddress, currentTimestampBigNumber.div(1000).toString());
            const initialTwapBalance: BigNumber = swapData.units.mul(swapData.realTimeCumulative.sub(swapData.initialCumulative)).div(decodeConst);
            const futureSwapData: SwapData = await poolContract.getUserSwapData(tokenAddress, userAddress, futureTimestampBigNumber.toString());
            const futureTwapBalance: BigNumber = futureSwapData.units.mul(futureSwapData.realTimeCumulative.sub(futureSwapData.initialCumulative)).div(decodeConst);

            // calculate reward balances
            const rewardData: SwapData = await poolContract.getUserRewardData(tokenAddress, userAddress, currentTimestampBigNumber.div(1000).toString());
            const initialRewardBalance: BigNumber = rewardData.units.mul(rewardData.realTimeCumulative.sub(rewardData.initialCumulative)).div(decodeConst).sub(initialBalance.div(100));
            const futureRewardData: SwapData = await poolContract.getUserRewardData(tokenAddress, userAddress, futureTimestampBigNumber.toString());
            const futureRewardBalance: BigNumber = futureRewardData.units.mul(futureRewardData.realTimeCumulative.sub(futureRewardData.initialCumulative)).div(decodeConst).sub(futureBalance.div(100));

            return {
                initialBalance,
                initialTwapBalance,
                initialRewardBalance:
                    initialRewardBalance.gt(0) ? initialRewardBalance : BigNumber.from(0),
                flowRate: futureBalance
                    .sub(initialBalance)
                    .div(REFRESH_INTERVAL),
                twapFlowRate: futureTwapBalance
                    .sub(initialTwapBalance)
                    .div(REFRESH_INTERVAL),
                rewardFlowRate:
                    futureRewardBalance.gt(0) ?
                        (
                            futureRewardBalance
                                .sub(initialRewardBalance)
                                .div(REFRESH_INTERVAL)
                        ) :
                        BigNumber.from(0),
                startDate: flowInfo.timestamp,
            };
        }

        // set token0 state
        // eslint-disable-next-line vars-on-top, no-var
        var {
            initialBalance,
            initialTwapBalance,
            initialRewardBalance,
            flowRate,
            twapFlowRate,
            rewardFlowRate,
            // eslint-disable-next-line @typescript-eslint/no-shadow
            startDate,
        } = await getTokenProps({ tokenAddress: token0.address });

        // TODO: Proposed replacement:
        // const token1Props = await getTokenProps({
        //     tokenAddress: token1.address,
        // });
        // const initialBalance0 = token1Props.initialBalance;
        // etc...

        const initialBalance0 = initialBalance;
        const initialTwapBalance0 = initialTwapBalance;
        const startDate0 = startDate;
        setCurrentBalance0(initialBalance);
        setCurrentTwapBalance0(initialTwapBalance);
        setCurrentRewardBalance0(initialRewardBalance);
        setFlowRate0(flowRate);
        setTwapFlowRate0(twapFlowRate);
        setRewardFlowRate0(rewardFlowRate);
        setIsTwap0(twapFlowRate.gt(0));

        // set token1 state
        // eslint-disable-next-line vars-on-top, no-var
        var {
            initialBalance,
            initialTwapBalance,
            initialRewardBalance,
            flowRate,
            twapFlowRate,
            rewardFlowRate,
            startDate,
        } = await getTokenProps({ tokenAddress: token1.address });

        setCurrentBalance1(initialBalance);
        setCurrentTwapBalance1(initialTwapBalance);
        setCurrentRewardBalance1(initialRewardBalance);
        setFlowRate1(flowRate);
        setTwapFlowRate1(twapFlowRate);
        setRewardFlowRate1(rewardFlowRate);
        setIsTwap1(twapFlowRate.gt(0));

        // compute average price from total amounts streamed
        if (twapFlowRate.gt(0) && initialTwapBalance.gt(0)) {
            setAveragePrice(
                initialBalance0.mul(1000).div(initialTwapBalance).toNumber() /
                1000
            );
        } else if (initialTwapBalance0.gt(0)) {
            setAveragePrice(
                initialBalance.mul(1000).div(initialTwapBalance0).toNumber() /
                1000
            );
        }

        // get current price
        /*
        const token0Flow: BigNumber = await poolContract.getFlowIn(
            token0.address
        );
        const token1Flow: BigNumber = await poolContract.getFlowIn(
            token1.address
        );
        */

        // get current price
        const token0Flow: BigNumber = BigNumber.from(
            await sf.cfaV1.getNetFlow({
                superToken: token0.address,
                account: poolAddress,
                providerOrSigner: provider
            })
        );
        const token1Flow: BigNumber = BigNumber.from(
            await sf.cfaV1.getNetFlow({
                superToken: token1.address,
                account: poolAddress,
                providerOrSigner: provider
            })
        );

        if (twapFlowRate.gt(0)) {
            // setCurrentPrice(token1Flow.mul(1000).div(token0Flow).toNumber() / 1000);
            setCurrentPrice(
                token0Flow.mul(1000).div(token1Flow).toNumber() / 1000
            );
        } else {
            // setCurrentPrice(token0Flow.mul(1000).div(token1Flow).toNumber() / 1000);
            setCurrentPrice(
                token1Flow.mul(1000).div(token0Flow).toNumber() / 1000
            );
        }

        // set start date to most recent one
        setStartDate(
            startDate0.valueOf() > startDate.valueOf() ? startDate0 : startDate
        );

        // update isLoading and positionFound vars
        setPositionFound(initialBalance0.gt(0) || initialBalance.gt(0));
        setIsLoading(false);
    }

    // REFRESH(in milliseconds) = REFRESH_INTERVAL * ANIMATION_MINIMUM_STEP_TIME
    const [time, setTime] = useState(REFRESH_INTERVAL);
    useEffect(() => {
        const timer = setTimeout(() => {
            setTime(time + 1);
            if (time >= REFRESH_INTERVAL) {
                setTime(0);
                refresh();
            }

            // animate frame
            setCurrentBalance0((c) => c.add(flowRate0));
            setCurrentBalance1((c) => c.add(flowRate1));
            setCurrentTwapBalance0((c) => c.add(twapFlowRate0));
            setCurrentTwapBalance1((c) => c.add(twapFlowRate1));
            setCurrentRewardBalance0((c) => c.add(rewardFlowRate0));
            setCurrentRewardBalance1((c) => c.add(rewardFlowRate1));
        }, ANIMATION_MINIMUM_STEP_TIME);
        return () => {
            clearTimeout(timer);
        };
        // TODO: Assess missing dependency array values
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time]);

    // Reload info if any parameter changes
    useEffect(() => {
        setIsLoading(true);
        refresh();
        // TODO: Assess missing dependency array values
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userAddress, chain, provider, token0, token1]);

    return (
        <div className="flex justify-center w-full">
            {isLoading || (!isLoading && positionFound) ? (
                <div
                    className={`w-full max-w-4xl space-y-4 mx-4 md:mx-8 ${isLoading ? "opacity-" : ""
                        }`}
                >
                    <div className="flex w-full max-w-4xl space-x-2 pt-4 md:pt-0">
                        <Link href="/my-streams">
                            <div className="p-2 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-700/60 transition-all duration-300">
                                <IoArrowBack size={25} />
                            </div>
                        </Link>
                        <div className="flex grow" />
                        {userAddress && address && userAddress === address && (
                            <ButtonWithInfoPopup
                                message="Edit stream"
                                button={
                                    <Link
                                        href={
                                            isTwap0 && isTwap1
                                                ? "/provide-liquidity"
                                                : "/"
                                        }
                                    >
                                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, jsx-a11y/anchor-is-valid */}
                                        <a
                                            onClick={() => {
                                                if (token0 && token1) {
                                                    // set swap tokens to this pool's tokens
                                                    if (isTwap1) {
                                                        store.setOutboundToken(
                                                            token0
                                                        );
                                                        store.setInboundToken(
                                                            token1
                                                        );
                                                    } else {
                                                        store.setOutboundToken(
                                                            token1
                                                        );
                                                        store.setInboundToken(
                                                            token0
                                                        );
                                                    }
                                                }
                                            }}
                                            className="bg-aqueductBlue/5 dark:bg-aqueductBlue/20 text-aqueductBlue p-2 rounded-xl hover:bg-aqueductBlue/10 dark:hover:bg-aqueductBlue/30 transition-all duration-300"
                                        >
                                            <RiPencilFill size={25} />
                                        </a>
                                    </Link>
                                }
                            />
                        )}
                        {userAddress && address && userAddress === address && (
                            <ButtonWithInfoPopup
                                message="Cancel stream"
                                button={
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            try {
                                                if (
                                                    token0 &&
                                                    token1 &&
                                                    address &&
                                                    userAddress &&
                                                    address === userAddress
                                                ) {
                                                    const chainId = chain?.id;
                                                    const superfluid =
                                                        await Framework.create({
                                                            chainId:
                                                                Number(chainId),
                                                            provider,
                                                        });

                                                    // different operation if providing liquidity or not
                                                    const operations: Operation[] =
                                                        [];
                                                    if (isTwap0) {
                                                        const operation =
                                                            superfluid.cfaV1.deleteFlow(
                                                                {
                                                                    sender: address,
                                                                    receiver:
                                                                        getPoolAddress(
                                                                            token0.value,
                                                                            token1.value
                                                                        ),
                                                                    superToken:
                                                                        token1.address,
                                                                }
                                                            );
                                                        operations.push(
                                                            operation
                                                        );
                                                    }
                                                    if (isTwap1) {
                                                        const operation =
                                                            superfluid.cfaV1.deleteFlow(
                                                                {
                                                                    sender: address,
                                                                    receiver:
                                                                        getPoolAddress(
                                                                            token0.value,
                                                                            token1.value
                                                                        ),
                                                                    superToken:
                                                                        token0.address,
                                                                }
                                                            );
                                                        operations.push(
                                                            operation
                                                        );
                                                    }

                                                    if (operations.length > 0) {
                                                        const batchCall =
                                                            superfluid.batchCall(
                                                                operations
                                                            );
                                                        setIsDeleting(true);
                                                        const result =
                                                            await batchCall.exec(
                                                                signer
                                                            );
                                                        await result.wait();
                                                        setIsDeleting(false);

                                                        // console.log("Stream deleted: ", result);
                                                        showToast(
                                                            ToastType.Success
                                                        );
                                                    }
                                                }
                                            } catch (error) {
                                                // console.log("Error: ", error);
                                                showToast(
                                                    getToastErrorType(error)
                                                );
                                                setIsDeleting(false);
                                            }
                                        }}
                                        className="bg-red-100/50 dark:bg-red-500/20 text-red-600 p-2 rounded-xl hover:bg-red-200/50 dark:hover:bg-red-500/30 transition-all duration-300"
                                        disabled={isLoading || isDeleting}
                                    >
                                        {isDeleting ? (
                                            <div className="scale-90">
                                                <LoadingSpinner size={25} />
                                            </div>
                                        ) : (
                                            <RiCloseCircleFill size={25} />
                                        )}
                                    </button>
                                }
                            />
                        )}
                    </div>
                    {userAddress && token0 && token1 && (
                        <div className="space-y-12 md:space-y-4">
                            <WidgetContainer
                                smallTitle="Total Amounts Streamed"
                                isUnbounded
                            >
                                <div className="md:space-y-3 lg:space-y-6 pb-2">
                                    <div className="space-y-4">
                                        {flowRate0.gt(0) && (
                                            <BalanceField
                                                currentBalance={currentBalance0}
                                                isTwap={false}
                                                token={token0}
                                                numDecimals={
                                                    19 -
                                                    flowRate0.toString()
                                                        .length -
                                                    (parseInt(
                                                        flowRate0.toString()[0]
                                                    ) > 5
                                                        ? 1
                                                        : 0)
                                                }
                                                isLoading={isLoading}
                                            />
                                        )}
                                        {flowRate1.gt(0) && (
                                            <BalanceField
                                                currentBalance={currentBalance1}
                                                isTwap={false}
                                                token={token1}
                                                numDecimals={
                                                    19 -
                                                    flowRate1
                                                        .add(1000)
                                                        .toString().length -
                                                    (parseInt(
                                                        flowRate1.toString()[0]
                                                    ) > 5
                                                        ? 1
                                                        : 0)
                                                }
                                                isLoading={isLoading}
                                            />
                                        )}
                                        {twapFlowRate0.gt(0) && (
                                            <BalanceField
                                                currentBalance={
                                                    currentTwapBalance0
                                                }
                                                isTwap
                                                token={token0}
                                                numDecimals={
                                                    19 -
                                                    twapFlowRate0.toString()
                                                        .length -
                                                    (parseInt(
                                                        twapFlowRate0.toString()[0]
                                                    ) > 5
                                                        ? 1
                                                        : 0)
                                                }
                                                isLoading={isLoading}
                                            />
                                        )}
                                        {twapFlowRate1.gt(0) && (
                                            <BalanceField
                                                currentBalance={
                                                    currentTwapBalance1
                                                }
                                                isTwap
                                                token={token1}
                                                numDecimals={
                                                    19 -
                                                    twapFlowRate1
                                                        .add(1000)
                                                        .toString().length -
                                                    (parseInt(
                                                        twapFlowRate1.toString()[0]
                                                    ) > 5
                                                        ? 1
                                                        : 0)
                                                }
                                                isLoading={isLoading}
                                            />
                                        )}
                                    </div>
                                </div>
                            </WidgetContainer>
                            {isTwap0 && isTwap1 ? (
                                <div className="flex flex-col lg:flex-row space-y-12 md:space-y-4 lg:space-x-4 lg:space-y-0">
                                    <RewardWidget
                                        isLoading={isLoading}
                                        title="Rewards"
                                        token0={token0}
                                        token1={token1}
                                        reward0={currentRewardBalance0}
                                        reward1={currentRewardBalance1}
                                        numDecimals0={
                                            19 -
                                            rewardFlowRate0.add(1000).toString()
                                                .length -
                                            (parseInt(
                                                rewardFlowRate0.toString()[0]
                                            ) > 5
                                                ? 1
                                                : 0)
                                        }
                                        numDecimals1={
                                            19 -
                                            rewardFlowRate1.add(1000).toString()
                                                .length -
                                            (parseInt(
                                                rewardFlowRate1.toString()[0]
                                            ) > 5
                                                ? 1
                                                : 0)
                                        }
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col lg:flex-row space-y-12 md:space-y-4 lg:space-x-4 lg:space-y-0">
                                    <PriceWidget
                                        isLoading={isLoading}
                                        title="Current Price"
                                        token0={isTwap1 ? token1 : token0}
                                        token1={isTwap1 ? token0 : token1}
                                        price={currentPrice}
                                    />
                                    <PriceWidget
                                        isLoading={isLoading}
                                        title="Average Price"
                                        token0={isTwap1 ? token1 : token0}
                                        token1={isTwap1 ? token0 : token1}
                                        price={averagePrice}
                                    />
                                </div>
                            )}
                            <WidgetContainer isUnbounded>
                                <div className="flex space-x-2 text-gray-800 dark:text-white font-medium md:-my-2">
                                    <p className="text-slate-500 font-normal pr-2">
                                        Start Date:
                                    </p>
                                    <p>{startDate?.toLocaleDateString()}</p>
                                    <p>{startDate?.toLocaleTimeString()}</p>
                                </div>
                            </WidgetContainer>
                            <div className="flex items-center space-x-2 md:px-8 md:pt-8">
                                <p className="pr-2">Share:</p>
                                <ButtonWithInfoPopup
                                    message="Copy link"
                                    button={
                                        <button
                                            type="button"
                                            className="p-2 bg-aqueductBlue rounded-xl text-white"
                                            onClick={() => {
                                                if (address) {
                                                    navigator.clipboard.writeText(
                                                        getSharedLink(
                                                            "goerli",
                                                            address,
                                                            token0.address,
                                                            token1.address
                                                        )
                                                    );
                                                }
                                            }}
                                        >
                                            <BiLink size={22} />
                                        </button>
                                    }
                                />
                                <ButtonWithInfoPopup
                                    message="Share on Twitter"
                                    button={
                                        <a
                                            className="p-2 bg-[#1DA1F2] rounded-xl text-white"
                                            href={
                                                address
                                                    ? getTweetTemplate(
                                                        getSharedLink(
                                                            "goerli",
                                                            address,
                                                            token0.address,
                                                            token1.address
                                                        )
                                                    )
                                                    : ""
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <IoLogoTwitter size={22} />
                                        </a>
                                    }
                                />
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <PageNotFound />
            )}
        </div>
    );
};

export default PoolInteractionVisualization;
