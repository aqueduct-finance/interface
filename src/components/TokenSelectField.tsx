import Dropdown from "./Dropdown";
import Token from "../types/Token";
import { useStore } from "../store";

const TokenSelectField = () => {
    const store = useStore();

    return (
        <div>
            <Dropdown
                title='Outbound token'
                dropdownItems={[Token.ETHxp, Token.fDAIxp, Token.fUSDCxp]}
                setToken={store.setOutboundToken}
            />
            <Dropdown
                title='Inbound token'
                dropdownItems={[Token.fDAIxp, Token.ETHxp, Token.fUSDCxp]}
                setToken={store.setInboundToken}
            />
        </div>
    );
};

export default TokenSelectField;
