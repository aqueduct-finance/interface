import { useCallback, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import IToast from "../types/Toast";

interface ToastMessageProps {
    toastList: IToast[];
    setToastList: (toast: IToast[]) => void;
}

const ToastMessage = ({ toastList, setToastList }: ToastMessageProps) => {
    const deleteToast = useCallback(
        (id: number) => {
            const toastListItems = toastList.filter((e) => e.id !== id);
            setToastList(toastListItems);
        },
        [toastList, setToastList]
    );

    useEffect(() => {
        const interval = setInterval(() => {
            if (toastList.length) {
                deleteToast(toastList[0].id);
            }
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, [toastList, deleteToast]);

    return (
        <div className="fixed z-10 bottom-8 right-4 animate-toast-in-right">
            {toastList.map((toast) => (
                <div
                    key={toast.id}
                    className="h-20 w-88 p-4 mb-4 rounded-2xl text-white shadow-md opacity-90 hover:shadow-none hover:opacity-100 transition ease delay-300 animate-toast-in-right"
                    style={{ backgroundColor: toast.backgroundColor }}
                >
                    <button
                        type="button"
                        className="float-right bg-none border-none text-white opacity-80 cursor-pointer"
                        onClick={() => deleteToast(toast.id)}
                    >
                        <IoClose size={18} />
                    </button>
                    <div>
                        <p className="font-bold text-left mt-0 mb-2 w-72 h-4">
                            {toast.title}
                        </p>
                        <p className="m-0 text-left">{toast.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ToastMessage;
