"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useToastStore, type Toast, type ToastType } from "@/lib/store/toast-store";
import { cn } from "@/lib/utils/cn";

const CONFIG: Record<ToastType, { icon: React.ElementType; colors: string; iconColor: string }> = {
    success: {
        icon: CheckCircle,
        colors: "border-success-500/30 bg-white dark:bg-surface-dark-secondary",
        iconColor: "text-success-500",
    },
    error: {
        icon: XCircle,
        colors: "border-error-500/30 bg-white dark:bg-surface-dark-secondary",
        iconColor: "text-error-500",
    },
    info: {
        icon: Info,
        colors: "border-primary-500/30 bg-white dark:bg-surface-dark-secondary",
        iconColor: "text-primary-500",
    },
    warning: {
        icon: AlertTriangle,
        colors: "border-warning-500/30 bg-white dark:bg-surface-dark-secondary",
        iconColor: "text-warning-500",
    },
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
    const [visible, setVisible] = useState(false);
    const { icon: Icon, colors, iconColor } = CONFIG[toast.type];

    useEffect(() => {
        // Trigger enter animation
        const t = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(t);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => onRemove(toast.id), 300);
    };

    return (
        <div
            className={cn(
                "flex items-start gap-3 w-full max-w-sm rounded-2xl border shadow-elevated px-4 py-3.5",
                "transition-all duration-300",
                colors,
                visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            )}
        >
            <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", iconColor)} />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{toast.title}</p>
                {toast.message && (
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{toast.message}</p>
                )}
            </div>
            <button
                onClick={handleClose}
                className="shrink-0 rounded-lg p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Dismiss"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

export function ToastContainer() {
    const { toasts, removeToast } = useToastStore();

    if (toasts.length === 0) return null;

    return (
        <div
            role="region"
            aria-label="Notifications"
            className="fixed bottom-6 right-4 sm:right-6 z-[100] flex flex-col gap-3 items-end"
        >
            {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} onRemove={removeToast} />
            ))}
        </div>
    );
}
