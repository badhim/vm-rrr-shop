import { useState } from "react";

const useToast = () => {
    const [toastMessage, setToastMessage] = useState("");

    const showToast = (message) => {
        if (typeof window.showToast === 'function') {
            setToastMessage(message);
            window.showToast(message);
        } else {
            console.error('showToast is not defined');
        }
    }

    const showNotImplemented = () => {
        showToast('Not implemented yet');
    }

    return { toastMessage, showToast, showNotImplemented };
}

export default useToast;