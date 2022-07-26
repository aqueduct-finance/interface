import { IconContext } from "react-icons";
import { CgArrowsExpandRight } from "react-icons/cg";
import Link from "next/link";
import WidgetContainer from "../widgets/WidgetContainer";

interface TableRowProps {
    columnProps: string[];
    columnComponents: ((...args: any) => JSX.Element)[];
    link: string;
    data: any[];
}

const TableRow = ({
    columnProps,
    columnComponents,
    link,
    data,
}: TableRowProps) => (
    <Link href={link}>
        <div className="relative flex p-4 items-center rounded-xl dark:text-white border-[1px] border-gray-200 dark:border-gray-700 cursor-pointer hover:centered-shadow dark:hover:centered-shadow-md-dark transition-all duration-300">
            {data.map((d, i) => (
                // TODO: don't use index as key
                // eslint-disable-next-line react/no-array-index-key
                <div className={columnProps[i]} key={`row-${i}`}>
                    {columnComponents[i](d)}
                </div>
            ))}
            <div className="absolute right-4 hidden xs:ml-12 xs:flex">
                {/* TODO: useMemo hook */}
                {/* eslint-disable-next-line react/jsx-no-constructed-context-values */}
                <IconContext.Provider value={{ color: "#64748b" }}>
                    <CgArrowsExpandRight />
                </IconContext.Provider>
            </div>
        </div>
    </Link>
);

interface GenericTableProps {
    title: string;
    labels: string[];
    columnProps: string[];
    columnComponents: ((...args: any) => JSX.Element)[];
    rowLinks: string[] | undefined;
    data: any[][] | undefined;
    isLoading: boolean;
}

const GenericTable = ({
    title,
    labels,
    columnProps,
    columnComponents,
    rowLinks,
    data,
    isLoading,
}: GenericTableProps) => (
    <WidgetContainer title={title} isUnbounded>
        <div className="flex px-4">
            {labels.map((label, i) => (
                <div className={columnProps[i]} key={label}>
                    {label}
                </div>
            ))}
        </div>
        {isLoading ? (
            <div className="flex flex-col space-y-4">
                {[0, 1, 2].map((i) => (
                    <div
                        className="w-full p-4 text-transparent bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"
                        key={`loading-${i}`}
                    >
                        -
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex flex-col space-y-4">
                {data &&
                    data.map((d, i) => (
                        <TableRow
                            columnProps={columnProps}
                            columnComponents={columnComponents}
                            link={rowLinks ? rowLinks[i] : ""}
                            data={d}
                            // TODO: don't use index as key
                            // eslint-disable-next-line react/no-array-index-key
                            key={`column-${i}`}
                        />
                    ))}
            </div>
        )}
    </WidgetContainer>
);

export default GenericTable;
