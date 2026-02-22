"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// ─── Sort Options ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
    { label: "Newest", value: "created_at" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Name: A–Z", value: "title_asc" },
] as const;

type SortValue = typeof SORT_OPTIONS[number]["value"];

// ─── Filter Sidebar ───────────────────────────────────────────────────────────
interface FilterSidebarProps {
    collections: { id: string; handle: string; title: string }[];
    categories: { id: string; handle: string; name: string }[];
    selectedCollections: string[];
    selectedCategories: string[];
    onCollectionChange: (id: string) => void;
    onCategoryChange: (id: string) => void;
    onClearAll: () => void;
    mobileOpen: boolean;
    onMobileClose: () => void;
}

function FilterSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(true);
    return (
        <div className="border-b border-gray-100 dark:border-white/5 pb-4 last:border-0">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between py-3 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
                {title}
                <ChevronDown
                    className={cn(
                        "h-4 w-4 text-gray-400 transition-transform duration-200",
                        open && "rotate-180"
                    )}
                />
            </button>
            {open && <div className="space-y-2 pt-1">{children}</div>}
        </div>
    );
}

function FilterCheckbox({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <label className="flex items-center gap-2.5 cursor-pointer group">
            <div
                className={cn(
                    "h-4 w-4 rounded border-2 flex items-center justify-center transition-all duration-150",
                    checked
                        ? "border-primary-600 bg-primary-600"
                        : "border-gray-300 dark:border-gray-600 group-hover:border-primary-400"
                )}
                onClick={onChange}
            >
                {checked && (
                    <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                    </svg>
                )}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {label}
            </span>
        </label>
    );
}

export function FilterSidebar({
    collections,
    categories,
    selectedCollections,
    selectedCategories,
    onCollectionChange,
    onCategoryChange,
    onClearAll,
    mobileOpen,
    onMobileClose,
}: FilterSidebarProps) {
    const hasFilters = selectedCollections.length > 0 || selectedCategories.length > 0;

    const sidebarContent = (
        <aside className="flex flex-col gap-1">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-primary-600" />
                    <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Filters</h2>
                    {hasFilters && (
                        <span className="rounded-full bg-primary-600 text-white text-xs px-2 py-0.5 font-medium">
                            {selectedCollections.length + selectedCategories.length}
                        </span>
                    )}
                </div>
                {hasFilters && (
                    <button
                        onClick={onClearAll}
                        className="text-xs text-error-500 hover:text-error-600 font-medium transition-colors"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
                <FilterSection title="Category">
                    {categories.map((cat) => (
                        <FilterCheckbox
                            key={cat.id}
                            label={cat.name}
                            checked={selectedCategories.includes(cat.id)}
                            onChange={() => onCategoryChange(cat.id)}
                        />
                    ))}
                </FilterSection>
            )}

            {/* Collection/Brand Filter */}
            {collections.length > 0 && (
                <FilterSection title="Brand / Series">
                    {collections.map((col) => (
                        <FilterCheckbox
                            key={col.id}
                            label={col.title}
                            checked={selectedCollections.includes(col.id)}
                            onChange={() => onCollectionChange(col.id)}
                        />
                    ))}
                </FilterSection>
            )}
        </aside>
    );

    return (
        <>
            {/* Desktop */}
            <div className="hidden lg:block w-56 shrink-0">
                <div className="sticky top-24 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-surface-dark-secondary p-4 shadow-card">
                    {sidebarContent}
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onMobileClose}
                    />
                    <div className="absolute inset-y-0 left-0 w-72 bg-white dark:bg-surface-dark shadow-modal p-6 overflow-y-auto animate-slide-up">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-gray-900 dark:text-white">Filters</h2>
                            <button onClick={onMobileClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        {sidebarContent}
                    </div>
                </div>
            )}
        </>
    );
}

// ─── Sort + Toolbar ───────────────────────────────────────────────────────────
export function ProductToolbar({
    total,
    sort,
    onSortChange,
    onMobileFilterOpen,
    activeFilterCount,
}: {
    total: number;
    sort: SortValue;
    onSortChange: (value: SortValue) => void;
    onMobileFilterOpen: () => void;
    activeFilterCount: number;
}) {
    return (
        <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 dark:border-white/5 mb-6">
            <div className="flex items-center gap-3">
                {/* Mobile filter toggle */}
                <button
                    onClick={onMobileFilterOpen}
                    className={cn(
                        "lg:hidden flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                        activeFilterCount > 0
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                            : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-gray-300"
                    )}
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="rounded-full bg-primary-600 text-white text-xs px-1.5 font-medium">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{total}</span>{" "}
                    {total === 1 ? "product" : "products"}
                </p>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
                <label className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">Sort:</label>
                <select
                    value={sort}
                    onChange={(e) => onSortChange(e.target.value as SortValue)}
                    className={cn(
                        "rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark-secondary",
                        "px-3 py-2 text-sm text-gray-700 dark:text-gray-200",
                        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                        "transition-all"
                    )}
                >
                    {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
