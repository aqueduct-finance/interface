import type { NextPage } from "next";
import Header from "../components/Header";

import ProvideLiquidityWidget from "../components/widgets/ProvideLiquidityWidget";

interface ProvideLiquidityProps {
    account: string;
}

const ProvideLiquidity: NextPage<ProvideLiquidityProps> = ({ account }) => {
    return (
        <div>
            <Header account={account} />
            <ProvideLiquidityWidget />
            provide liquidity
        </div>
    );
};

export default ProvideLiquidity;
