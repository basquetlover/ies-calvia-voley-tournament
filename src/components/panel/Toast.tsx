// components/Toast.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import "../../components/panel/StylesReact.css"
type ToastType = "success" | "error" | "warning" | "info" | "localSave";

interface Toast {
id: string;
type: ToastType;
message: string;
duration: number; // 0 = no auto dismiss
dismissible: boolean;
}

interface ToastOptions extends Omit<Toast, "id" | "duration" | "dismissible"> {
duration?: number;
dismissible?: boolean;
}

const MAX_TOASTS = 5;

const ToastIcon = ({ type }: { type: ToastType }) => {
const icons = {
    success: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57z"/>
    </svg>
    ),
    error: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
        <path d="M508.5-291.5Q520-303 520-320t-11.5-28.5T480-360t-28.5 11.5T440-320t11.5 28.5T480-280t28.5-11.5M440-440h80v-240h-80zm40 360q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80m0-80q134 0 227-93t93-227-93-227-227-93-227 93-93 227 93 227 227 93m0-320"/>
    </svg>
    ),
    warning: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
        <path d="m40-120 440-760 440 760zm138-80h604L480-720zm330.5-51.5Q520-263 520-280t-11.5-28.5T480-320t-28.5 11.5T440-280t11.5 28.5T480-240t28.5-11.5M440-360h80v-200h-80zm40-100"/>
    </svg>
    ),
    info: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
        <path d="M440-280h80v-240h-80v240Zm68.5-331.5Q520-623 520-640t-11.5-28.5Q497-680 480-680t-28.5 11.5Q440-657 440-640t11.5 28.5Q463-600 480-600t28.5-11.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
    </svg>
    ),
    localSave:(
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 -960 960 960">
            <path d="m414-280 226-226-58-58-169 169-84-84-57 57zM260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160zm0-80h480q42 0 71-29t29-71-29-71-71-29h-60v-80q0-83-58.5-141.5T480-720t-141.5 58.5T280-520h-20q-58 0-99 41t-41 99 41 99 99 41m220-240"/>
        </svg>
    ),
};

return icons[type];
};

const bgColors = {
    success: "bg-green-500/40 border-green-500/60",
    error: "bg-red-500/40 border-red-500/60",
    warning: "bg-orange-500/40 border-orange-500/60",
    info: "bg-blue-500/40 border-blue-500/60",
    localSave: "bg-purple-500/40 border-purple-500/60 fill-purple-500",
};

export const useToast = () => {
const addToast = useCallback((options: ToastOptions) => {
    window.dispatchEvent(
    new CustomEvent("add-toast", { detail: options })
    );
}, []);

return { addToast };
};

export default function ToastContainer() {
const [toasts, setToasts] = useState<Toast[]>([]);
const queueRef = useRef<Toast[]>([]);
const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

// ADD TOAST
useEffect(() => {
    const handleAddToast = (e: Event) => {
    const customEvent = e as CustomEvent;
    const options = customEvent.detail;

    const newToast: Toast = {
        ...options,
        id: Math.random().toString(36).slice(2),
        duration: options.duration ?? 4500,
        dismissible: options.dismissible ?? true,
    };

    setToasts((prev) => {
        if (prev.length < MAX_TOASTS) {
        return [...prev, newToast];
        }

        queueRef.current.push(newToast);
        return prev;
    });
    };

    window.addEventListener("add-toast", handleAddToast);
    return () => window.removeEventListener("add-toast", handleAddToast);
}, []);

// REMOVE + PROMOTE QUEUE
const removeToast = (id: string) => {
    setToasts((prev) => {
    const updated = prev.filter((t) => t.id !== id);

    // limpiar timer
    const timer = timersRef.current.get(id);
    if (timer) {
        clearTimeout(timer);
        timersRef.current.delete(id);
    }

    // meter siguiente de la cola
    if (queueRef.current.length > 0 && updated.length < MAX_TOASTS) {
        const next = queueRef.current.shift();
        if (next) {
        updated.push(next);
        }
    }

    return updated;
    });
};

// AUTO DISMISS
useEffect(() => {
    toasts.forEach((toast) => {
    if (toast.duration > 0 && !timersRef.current.has(toast.id)) {
        const timer = setTimeout(() => {
        removeToast(toast.id);
        }, toast.duration);

        timersRef.current.set(toast.id, timer);
    }
    });

    return () => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    };
}, [toasts]);

if (toasts.length === 0) return null;

return (
    <div className="fixed top-6 right-6 z-100 flex flex-col gap-3 max-w-95 w-full pointer-events-none">
    {toasts.map((toast) => (
        <div
        key={toast.id}
        className={`
            pointer-events-auto w-full items-center p-4 rounded-2xl border-l-5 toast-blur border shadow-xl
            ${bgColors[toast.type]} flex  gap-3
            animate-in slide-in-from-right-4 fade-in duration-300
        `}
        >
        <div className="shrink-0 mt-0.5">
            <ToastIcon type={toast.type} />
        </div>

        <div className="flex-1 text-sm font-medium leading-tight pt-0.5 text-blanco">
            {toast.message}
        </div>

        {toast.dismissible && (
            <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 cursor-pointer text-current opacity-70 hover:opacity-100 text-lg leading-none mt-0.5"
            >
            ✕
            </button>
        )}
        </div>
    ))}
    </div>
);
}