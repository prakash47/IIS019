import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const variants = {
    primary:
        "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-xs hover:shadow-card",
    secondary:
        "bg-primary-100 text-primary-700 hover:bg-primary-200 active:bg-primary-300",
    outline:
        "border-2 border-primary-300 text-primary-700 hover:bg-primary-50 active:bg-primary-100",
    ghost:
        "text-primary-600 hover:bg-primary-50 active:bg-primary-100",
    destructive:
        "bg-error-500 text-white hover:bg-error-600 active:bg-error-600",
    accent:
        "bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 shadow-xs",
} as const;

const sizes = {
    sm: "h-8 px-3 text-sm rounded-md gap-1.5",
    md: "h-10 px-4 text-sm rounded-lg gap-2",
    lg: "h-12 px-6 text-base rounded-lg gap-2.5",
    xl: "h-14 px-8 text-lg rounded-xl gap-3",
    icon: "h-10 w-10 rounded-lg",
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof variants;
    size?: keyof typeof sizes;
    isLoading?: boolean;
    asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "primary",
            size = "md",
            isLoading = false,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center font-medium transition-all duration-200",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
                    "disabled:opacity-50 disabled:pointer-events-none",
                    "select-none cursor-pointer",
                    variants[variant],
                    sizes[size],
                    isLoading && "opacity-70 pointer-events-none",
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="animate-spin -ml-1 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };
