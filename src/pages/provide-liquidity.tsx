import type { NextPage } from "next";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

interface ProvideLiquidityProps {
    account: string;
}

const ProvideLiquidity: NextPage<ProvideLiquidityProps> = ({ account }) => {
    return (
        <div className="flex items-center">
            <Sidebar account={account} />
            provide liquidity
        </div>
    );
};

export default ProvideLiquidity;
