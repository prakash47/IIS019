import { cn } from "@/lib/utils/cn";

const badgeVariants = {
    default: "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300",
    secondary: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    success: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    destructive: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    outline: "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
    sale: "bg-red-500 text-white",
    new: "bg-primary-600 text-white",
} as const;

const badgeSizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1 text-sm",
} as const;

interface BadgeProps {
    variant?: keyof typeof badgeVariants;
    size?: keyof typeof badgeSizes;
    className?: string;
    children: React.ReactNode;
}

export function Badge({
    variant = "default",
    size = "md",
    className,
    children,
}: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center font-medium rounded-full whitespace-nowrap",
                badgeVariants[variant],
                badgeSizes[size],
                className
            )}
        >
            {children}
        </span>
    );
}
