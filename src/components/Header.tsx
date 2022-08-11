import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "./../../public/aqueduct-logo.png";

const navItems: { label: string; page: string }[] = [
    { label: "Swap", page: "/" },
    { label: "Provide Liquidity", page: "/provide-liquidity" },
    { label: "Upgrade", page: "/upgrade" },
    { label: "Downgrade", page: "/downgrade" },
];

interface HeaderProps {
    account: string;
}

const Header = ({ account }: HeaderProps) => {
    const router = useRouter();

    return (
        <header className="flex flex-row justify-between items-center h-20 px-4 w-full">
            <Head>
                <title>Aqueduct</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-3xl font-bold pr-3">Aqueduct</h1>
                <Image
                    src={logo}
                    alt="Aqueduct logo"
                    layout="fixed"
                    width="50px"
                    height="50px"
                />
            </div>
            <ul className="flex justify-between items-center h-9 w-100 px-1 bg-gray-800 rounded-2xl">
                {navItems.map(({ label, page }) => (
                    <li
                        key={label}
                        className={`rounded-xl px-2 py-0.5 ${
                            router.asPath === page ? "bg-white text-black" : ""
                        }`}
                    >
                        <Link href={page}>
                            <a>{label}</a>
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="flex items-center h-9 px-4 bg-gray-800 rounded-2xl">
                Address:{" "}
                {account === ""
                    ? "0x123..."
                    : account.slice(0, 6) + "..." + account.slice(-4)}
            </div>
        </header>
    );
};

export default Header;
