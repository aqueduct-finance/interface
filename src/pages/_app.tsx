import type { AppProps } from "next/app";
import { useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
    getDefaultWallets,
    RainbowKitProvider,
    lightTheme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import "../styles/globals.css";
import CustomAvatar from "../components/CustomAvatar";
import ToastType from "../types/ToastType";
import ToastMessage from "../components/ToastMessage";
import IToast from "../types/Toast";
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/router";

const { chains, provider } = configureChains(
    [chain.goerli],
    [alchemyProvider({ apiKey: 'y-XrzXcnrI5-InGayOmqKAfZOADFvF8s' })]
);
//[jsonRpcProvider({ rpc: () => { return {http: 'https://goerli.infura.io/v3/'} } })]
//publicProvider()

const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    chains,
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

function MyApp({ Component, pageProps }: AppProps) {
    const [toastList, setToastList] = useState<IToast[]>([]);
    let toast: IToast;

    const showToast = (type: ToastType) => {
        switch (type) {
            case ToastType.Success:
                toast = {
                    id: toastList.length + 1,
                    title: "Success",
                    description: "Success message",
                    backgroundColor: "#5cb85c",
                };
                break;
            case ToastType.Error:
                toast = {
                    id: toastList.length + 1,
                    title: "Error",
                    description: "An unexpected error has occured",
                    backgroundColor: "#d9534f",
                };
                break;
            case ToastType.Warning:
                toast = {
                    id: toastList.length + 1,
                    title: "Warning",
                    description: "This is a warning toast component",
                    backgroundColor: "#f0ed4e",
                };
                break;
            case ToastType.Info:
                toast = {
                    id: toastList.length + 1,
                    title: "Info",
                    description: "This is a info toast component",
                    backgroundColor: "#5bc0de",
                };
                break;
            case ToastType.ConnectWallet:
                toast = {
                    id: toastList.length + 1,
                    title: "Error",
                    description: "Please connect a wallet.",
                    backgroundColor: "#FDB833",
                };
                break;
            default:
                toast = {
                    id: toastList.length + 1,
                    title: "IToast message error",
                    description: "An unexpected error has occured",
                    backgroundColor: "#d9534f",
                };
        }

        setToastList([...toastList, toast]);
    };

    const [isShown, setIsShown] = useState(false);
    const router = useRouter();

    return (
        <>
            {
                router.pathname == '/landing'
                ?
                <Component {...pageProps} />
                :
                <WagmiConfig client={wagmiClient}>
                    <RainbowKitProvider
                        chains={chains}
                        theme={lightTheme({ accentColor: "#2662CB" })}
                        avatar={CustomAvatar}
                    >
                        <div className="w-full h-screen text-slate-500 poppins-font bg-white dark:bg-black">
                            <div className="flex flex-col md:flex-row h-full items-center md:items-stretch">
                                <Sidebar isShown={isShown} setIsShown={setIsShown} />
                                <main
                                    className={
                                        "flex flex-col items-center space-y-4 md:space-y-16 px-4 w-full overflow-y-scroll"
                                        + (isShown && "hidden md:flex")
                                    }
                                >
                                    <div className="md:h-[50%]" />
                                    <Component {...pageProps} showToast={showToast} />
                                    <div className="md:h-full" />
                                </main>
                            </div>
                            <ToastMessage
                                toastList={toastList}
                                setToastList={setToastList}
                            />
                        </div>
                    </RainbowKitProvider>
                </WagmiConfig>
            }
        </>
    );
}

export default MyApp;
