interface NumberEntryFieldProps {
    title: string;
    number: string;
    setNumber: (number: string) => void;
}

const NumberEntryField = ({
    title,
    number,
    setNumber,
}: NumberEntryFieldProps) => {
    return (
        <div className="bg-gray-700 rounded-2xl">
            <div className="absolute pl-4 pt-3 text-xs font-semibold text-white">
                {title}
            </div>
            <input
                className="h-20 text-2xl w-full pt-6 font-semibold bg-white/5 rounded-2xl px-4 numbers-font-2 text-white"
                type="text"
                pattern="^[0-9]*[.,]?[0-9]*$"
                placeholder="0.0"
                value={number}
                onChange={(e) => {
                    if (e.target.value.match("^[0-9]*[.]?[0-9]*$") != null) {
                        setNumber(e.target.value);
                    }
                }}
            />
        </div>
    );
};

export default NumberEntryField;
