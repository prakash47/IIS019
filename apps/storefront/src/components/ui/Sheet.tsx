"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { X } from "lucide-react";

interface SheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    side?: "left" | "right";
    className?: string;
}

export function Sheet({
    isOpen,
    onClose,
    title,
    children,
    side = "right",
    className,
}: SheetProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    ref={overlayRef}
                    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fade-in"
                    onClick={onClose}
                />
            )}

            {/* Panel */}
            <div
                className={cn(
                    "fixed top-0 z-50 h-full w-full max-w-md bg-white dark:bg-surface-dark shadow-modal",
                    "transition-transform duration-300 ease-out",
                    side === "right" ? "right-0" : "left-0",
                    side === "right"
                        ? isOpen
                            ? "translate-x-0"
                            : "translate-x-full"
                        : isOpen
                            ? "translate-x-0"
                            : "-translate-x-full",
                    className
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? "sheet-title" : undefined}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    {title && (
                        <h2
                            id="sheet-title"
                            className="text-lg font-semibold text-gray-900 dark:text-white"
                        >
                            {title}
                        </h2>
                    )}
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors ml-auto"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto h-[calc(100%-65px)] p-6">
                    {children}
                </div>
            </div>
        </>
    );
}
