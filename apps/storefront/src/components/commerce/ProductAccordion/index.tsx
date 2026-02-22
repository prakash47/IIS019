"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AccordionItem {
    id: string;
    title: string;
    content: React.ReactNode;
}

interface ProductAccordionProps {
    items: AccordionItem[];
}

export function ProductAccordion({ items }: ProductAccordionProps) {
    const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

    const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

    return (
        <div className="divide-y divide-gray-100 dark:divide-white/5 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-surface-dark-secondary overflow-hidden shadow-card">
            {items.map((item) => {
                const isOpen = openId === item.id;
                return (
                    <div key={item.id}>
                        <button
                            onClick={() => toggle(item.id)}
                            className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                            aria-expanded={isOpen}
                        >
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                {item.title}
                            </span>
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 text-gray-400 transition-transform duration-200 shrink-0",
                                    isOpen && "rotate-180"
                                )}
                            />
                        </button>
                        <div
                            className={cn(
                                "overflow-hidden transition-all duration-300",
                                isOpen ? "max-h-96" : "max-h-0"
                            )}
                        >
                            <div className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                {item.content}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
