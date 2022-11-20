import { TbArrowsRight, TbArrowsRightLeft, TbCirclePlus } from "react-icons/tb";
import { MdAttachMoney } from "react-icons/md";
import { AiOutlineLineChart } from "react-icons/ai";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "./../../public/aq-logo-11-22.png";
import { useStore } from "../store";
import CustomWalletConnectButton from "./CustomWalletConnectButton";
import { IoClose, IoMenu } from 'react-icons/io5';
import { FiMoon } from 'react-icons/fi'
import { MdLightbulbOutline } from 'react-icons/md'
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDarkMode } from "../utils/DarkModeProvider";

interface SideBarTabProps {
    icon: any;
    label: string;
    page?: string;
    onClick?: () => void;
}

const navItems: { icon: any; label: string; page: string }[] = [
    {
        icon: <AiOutlineLineChart size={18} />,
        label: "My Streams",
        page: "/my-streams",
    },
    {
        icon: <TbArrowsRightLeft size={18} />,
        label: "Swap",
        page: "/"
    },
    {
        icon: <TbArrowsRight size={18} />,
        label: "Provide Liquidity",
        page: "/provide-liquidity",
    },
    {
        icon: <TbCirclePlus size={18} />,
        label: "Wrap / Unwrap",
        page: "/wrap"
    }
];

const SideBarTab = ({ icon, label, page, onClick }: SideBarTabProps) => {
    const router = useRouter();

    return (
        <button
            className={`flex w-full items-center space-x-3 pl-4 pr-8 py-4 md:pl-2 md:pr-6 md:py-2 rounded-xl transition-all ease-in-out duration-300
                        ${router.asPath === page
                    ? "bg-aqueductBlue/5 dark:bg-aqueductBlue/20 hover:bg-aqueductBlue/10"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800/60"
                } `}
            onClick={() => {
                if (page) {
                    router.push(page);
                } else if (onClick) {
                    onClick();
                }
            }}
        >
            <div
                className={`bg-gray-100 p-2 rounded-lg ${router.asPath === page
                    ? "bg-aqueductBlue/10 text-aqueductBlue dark:bg-transparent"
                    : "text-gray-400 dark:bg-gray-800/60 dark:text-white"
                    }`}
            >
                {icon}
            </div>
            <p
                className={`text-sm font-medium ${router.asPath === page
                    ? "bg-transparent text-aqueductBlue"
                    : "text-gray-600 dark:text-white"
                    }`}
            >
                {label}
            </p>
        </button>
    );
};

const Sidebar = ({ isShown, setIsShown }: { isShown: boolean, setIsShown: Dispatch<SetStateAction<boolean>> }) => {
    const store = useStore();
    const darkContext = useDarkMode();

    useEffect(() => {
        if (localStorage.getItem('color-theme') == 'light') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    })

    return (
        <header
            className={
                "flex flex-col p-4 w-full md:w-64 md:h-screen space-y-8 border-2 dark:dark-border-color flex-shrink-0 md:overflow-y-auto"
            }
        >
            <Head>
                <title>Aqueduct</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex items-center space-x-2 text-aqueductBlue">
                <Image
                    src={logo}
                    alt="Aqueduct logo"
                    layout="fixed"
                    width="45px"
                    height="45px"
                    className="rounded-xl opacity-95"
                />
                <div className="flex items-center h-full">
                    <h1 className="text-2xl font-semibold pl-1 poppins-font text-transparent bg-clip-text bg-gradient-to-br from-[#2B75CE] to-[#0C4791]">
                        aqueduct
                    </h1>
                </div>
                <div className="flex grow" />
                <button
                    className="md:hidden"
                    onClick={() => {
                        setIsShown(!isShown);
                    }}
                >
                    {
                        isShown
                            ?
                            <IoClose size={28} />
                            :
                            <IoMenu size={28} />
                    }
                </button>
            </div>
            <div
                className={
                    'grow space-y-8 transition-all duration-500 '
                    + (
                        isShown
                            ?
                            'flex flex-col w-full top-[64px] bottom-0 md:top-0 p-4 md:p-0 left-0 absolute md:relative z-50 bg-white dark:bg-black'
                            :
                            'hidden md:flex md:flex-col'
                    )
                }
            >
                <CustomWalletConnectButton />
                <ul className="space-y-3 pb-8">
                    {navItems.map(({ icon, label, page }) => (
                        <SideBarTab
                            icon={icon}
                            label={label}
                            page={page}
                            key={label}
                        />
                    ))}
                </ul>
                <div className={"flex grow"} ></div>
                {
                    <div>
                        <div className='flex grow' />
                        <div className="flex dark:hidden">
                            <SideBarTab
                                icon={<FiMoon size={18} />}
                                label={'Dark mode'}
                                key={'Dark mode'}
                                onClick={() => {
                                    document.documentElement.classList.add('dark');
                                    localStorage.setItem('color-theme', 'light');
                                    darkContext?.setIsDark(true);
                                }}
                            />
                        </div>
                        <div className="hidden dark:flex">
                            <SideBarTab
                                icon={<MdLightbulbOutline size={18} />}
                                label={'Light mode'}
                                key={'Light mode'}
                                onClick={() => {
                                    document.documentElement.classList.remove('dark');
                                    localStorage.setItem('color-theme', 'dark');
                                    darkContext?.setIsDark(false);
                                }}
                            />
                        </div>
                    </div>
                }
            </div>
        </header>
    );
};//hidden md:flex

export default Sidebar;
