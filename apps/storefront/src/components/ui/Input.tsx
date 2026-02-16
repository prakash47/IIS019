import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, id, type = "text", ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    type={type}
                    className={cn(
                        "flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2",
                        "text-sm placeholder:text-gray-400",
                        "transition-colors duration-200",
                        "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none",
                        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
                        "dark:border-gray-600 dark:bg-surface-dark-secondary dark:text-white",
                        "dark:placeholder:text-gray-500 dark:focus:border-primary-400",
                        error && "border-error-500 focus:border-error-500 focus:ring-error-500/20",
                        className
                    )}
                    aria-invalid={error ? "true" : undefined}
                    aria-describedby={
                        error
                            ? `${inputId}-error`
                            : helperText
                                ? `${inputId}-helper`
                                : undefined
                    }
                    {...props}
                />
                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="mt-1.5 text-sm text-error-500"
                        role="alert"
                    >
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p
                        id={`${inputId}-helper`}
                        className="mt-1.5 text-sm text-gray-500 dark:text-gray-400"
                    >
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
