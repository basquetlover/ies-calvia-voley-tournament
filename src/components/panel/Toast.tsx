// components/Toast.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";

type ToastType = "success" | "error" | "warning" | "info";

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
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
    ),
    error: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6h12v12" />
    </svg>
    ),
    warning: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
    ),
    info: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4v1m0-1H21a2 2 0 01-2 2V5a2 2 0 01-2-2V3a2 2 0 01-2-2z" />
    </svg>
    ),
};

return icons[type];
};

const bgColors = {
success: "bg-gris-claro border-green-500 text-green-600",
error: "bg-gris-claro border-red-500 text-red-600",
warning: "bg-gris-claro border-yellow-500 text-yellow-600",
info: "bg-gris-claro border-blue-500 text-blue-600",
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
            pointer-events-auto w-full items-center p-4 rounded-2xl border-l-5 border shadow-xl
            ${bgColors[toast.type]} flex  gap-3
            animate-in slide-in-from-right-4 fade-in duration-300
        `}
        >
        <div className="shrink-0 mt-0.5">
            <ToastIcon type={toast.type} />
        </div>

        <div className="flex-1 text-sm font-medium leading-tight pt-0.5">
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