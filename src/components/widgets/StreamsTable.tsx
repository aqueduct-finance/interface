import { useEffect, useState } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import { useAccount, useNetwork, useProvider } from "wagmi";
import BalancesField from "../table/BalancesField";
import GenericTable from "../table/GenericTable";
import { fDAIxp, fDAIxpfUSDCxpPool, fUSDCxp } from "../../utils/constants";
import { TokenOption } from "../../types/TokenOption";
import getToken from "../../utils/getToken";

const TextField = ({ title }: { title: string }) => (
    <div className="monospace-font text-sm font-semibold">{title}</div>
);

const PoolField = ({
    token0,
    token1,
}: {
    token0: TokenOption;
    token1: TokenOption;
}) => (
    <div className="flex items-center h-6 -space-x-2">
        {/* TODO: use Image */}
        {/* <Image
            src={token0.logo}
            className="z-10 drop-shadow-lg"
            width="28"
            height="28"
        />
        <Image
            src={token1.logo}
            className="drop-shadow-lg"
            width="28"
            height="28"
        /> */}
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={token0.logo} className="h-7 z-10 drop-shadow-lg" />
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={token1.logo} className="h-7 drop-shadow-lg" />
        <div className="flex text-sm pl-4 space-x-1 monospace-font font-semibold">
            <p>{token0.label}</p>
            <p>/</p>
            <p>{token1.label}</p>
        </div>
    </div>
);

const StreamsTable = () => {
    const provider = useProvider();
    const { chain } = useNetwork();
    const { address } = useAccount();

    const [data, setData] = useState<any[][]>();
    const [links, setLinks] = useState<string[]>();

    const [isLoading, setIsLoading] = useState(true);

    // get streams from pool contract
    // TODO: router/factory contract to track current streams so we don't have to manually check here
    const pools = [
        { token0: fDAIxp, token1: fUSDCxp, address: fDAIxpfUSDCxpPool },
    ];
    useEffect(() => {
        async function updateData() {
            if (!address || !chain || !provider) {
                return;
            }

            const chainId = chain?.id;
            const sf = await Framework.create({
                chainId: Number(chainId),
                provider,
            });

            const newData: any[][] = [];
            const newLinks: any[] = [];
            await Promise.all(
                pools.map(async (p) => {
                    const s = await sf.cfaV1.getFlow({
                        superToken: p.token0,
                        sender: address,
                        receiver: p.address,
                        providerOrSigner: provider,
                    });

                    const token0 = await getToken({
                        tokenAddress: p.token0,
                        provider,
                        chainId,
                    });
                    const token1 = await getToken({
                        tokenAddress: p.token1,
                        provider,
                        chainId,
                    });

                    if (s.flowRate !== "0" && token0 && token1) {
                        const date = new Date(s.timestamp);
                        newData.push([
                            { token0, token1 },
                            { title: date.toLocaleDateString() },
                            { token0, token1 },
                        ]);
                        newLinks.push(
                            `pair/goerli/${address}/${token0.address}/${token1.address}`
                        );
                    } else {
                        const s2 = await sf.cfaV1.getFlow({
                            superToken: p.token1,
                            sender: p.address,
                            receiver: address,
                            providerOrSigner: provider,
                        });
                        if (s2.flowRate !== "0" && token0 && token1) {
                            const date = new Date(s2.timestamp);
                            newData.push([
                                { token0, token1 },
                                { title: date.toLocaleDateString() },
                                { token0, token1 },
                            ]);
                            newLinks.push(
                                `pair/goerli/${address}/${token0.address}/${token1.address}`
                            );
                        }
                    }
                })
            );

            setData(newData);
            setLinks(newLinks);
            setIsLoading(false);
        }

        updateData();
        // TODO: Assess missing dependency array values
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, chain]);

    return (
        <section className="flex flex-col items-center w-full">
            <div className="w-full max-w-6xl">
                <GenericTable
                    title="My Streams"
                    labels={["Pool", "Start Date", "Balances"]}
                    columnProps={[
                        "min-w-[14rem] w-full max-w-[20rem]",
                        "min-w-[7rem] w-full max-w-[16rem]",
                        "min-w-[14rem] w-full max-w-[20rem] hidden lg:flex",
                    ]}
                    columnComponents={[PoolField, TextField, BalancesField]}
                    rowLinks={links}
                    data={data}
                    isLoading={isLoading}
                />
            </div>
        </section>
    );
};

export default StreamsTable;
