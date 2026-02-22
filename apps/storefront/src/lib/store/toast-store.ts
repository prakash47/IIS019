import { create } from "zustand";

// ─── Toast types ──────────────────────────────────────────────────────────────
export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number; // ms, default 4000
}

interface ToastState {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
    toasts: [],
    addToast: (toast) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
        // Auto-remove after duration
        setTimeout(() => {
            set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
        }, toast.duration ?? 4000);
    },
    removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// ─── Convenience helpers ──────────────────────────────────────────────────────
export const toast = {
    success: (title: string, message?: string) =>
        useToastStore.getState().addToast({ type: "success", title, message }),
    error: (title: string, message?: string) =>
        useToastStore.getState().addToast({ type: "error", title, message }),
    info: (title: string, message?: string) =>
        useToastStore.getState().addToast({ type: "info", title, message }),
    warning: (title: string, message?: string) =>
        useToastStore.getState().addToast({ type: "warning", title, message }),
};
