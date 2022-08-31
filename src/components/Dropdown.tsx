import { useStore } from "../store";
import { Token } from "../types/Token";

interface DropdownProps {
    dropdownItems: Token[];
    setToken: (token: Token) => void;
}

const Dropdown = ({ dropdownItems, setToken }: DropdownProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setToken(e.target.value as Token);
    };

    return (
        <select
            className="h-20 text-2xl w-full pt-6 mt-2 font-semibold bg-black/10 rounded-2xl px-4 numbers-font-2 text-slate-500"
            onChange={handleChange}
        >
            {dropdownItems.map((item) => (
                <option value={Token[item]} key={item}>
                    {Token[item].toString()}
                </option>
            ))}
        </select>
    );
};

export default Dropdown;
