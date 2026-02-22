"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import { registerCustomer } from "@/lib/medusa/actions/auth";
import { cn } from "@/lib/utils/cn";

function FormInput({
    label, id, type = "text", required, placeholder, value, onChange, rightElement, error,
}: {
    label: string; id: string; type?: string; required?: boolean;
    placeholder?: string; value: string; onChange: (val: string) => void;
    rightElement?: React.ReactNode; error?: string;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label} {required && <span className="text-error-500">*</span>}
            </label>
            <div className="relative">
                <input
                    id={id} type={type} placeholder={placeholder} value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={cn(
                        "h-11 w-full rounded-xl border px-4 text-sm transition-all",
                        "bg-white dark:bg-surface-dark-secondary text-gray-900 dark:text-white placeholder:text-gray-400",
                        "focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500",
                        error ? "border-error-500" : "border-gray-200 dark:border-white/10",
                        rightElement && "pr-11"
                    )}
                />
                {rightElement && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
                )}
            </div>
            {error && <p className="text-xs text-error-500">{error}</p>}
        </div>
    );
}

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        first_name: "", last_name: "", email: "", phone: "", password: "", confirm: "",
    });
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const field = (key: keyof typeof form) => ({
        value: form[key],
        onChange: (val: string) => setForm((p) => ({ ...p, [key]: val })),
    });

    const passwordStrength = () => {
        const p = form.password;
        if (!p) return 0;
        let score = 0;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        return score;
    };
    const strength = passwordStrength();
    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
    const strengthColor = ["", "bg-error-500", "bg-warning-500", "bg-success-500", "bg-success-600"][strength];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.first_name || !form.last_name || !form.email || !form.password) {
            setError("Please fill in all required fields.");
            return;
        }
        if (form.password !== form.confirm) {
            setError("Passwords do not match.");
            return;
        }
        if (form.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        setError(null);
        startTransition(async () => {
            const result = await registerCustomer({
                email: form.email,
                password: form.password,
                first_name: form.first_name,
                last_name: form.last_name,
                phone: form.phone || undefined,
            });
            if (result.success) {
                router.push("/account");
                router.refresh();
            } else {
                setError(result.error ?? "Registration failed. Please try again.");
            }
        });
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md animate-slide-up">
                <div className="text-center mb-8">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/30">
                        <UserPlus className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Create Account</h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Join Naman Ent for exclusive deals & faster checkout</p>
                </div>

                <div className="rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-surface-dark-secondary shadow-elevated p-8">
                    {error && (
                        <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-error-500/30 bg-error-500/10 px-4 py-3 text-sm text-error-600 dark:text-error-400 animate-slide-down">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput label="First Name" id="first_name" required placeholder="Rahul" {...field("first_name")} />
                            <FormInput label="Last Name" id="last_name" required placeholder="Sharma" {...field("last_name")} />
                        </div>
                        <FormInput label="Email Address" id="email" type="email" required placeholder="you@example.com" {...field("email")} />
                        <FormInput label="Phone (optional)" id="phone" type="tel" placeholder="+91 98765 43210" {...field("phone")} />
                        <FormInput
                            label="Password" id="password" type={showPw ? "text" : "password"}
                            required placeholder="Min. 8 characters" {...field("password")}
                            rightElement={
                                <button type="button" onClick={() => setShowPw(v => !v)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            }
                        />

                        {/* Password strength meter */}
                        {form.password && (
                            <div className="space-y-1.5">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className={cn("h-1 flex-1 rounded-full transition-all duration-300",
                                            i <= strength ? strengthColor : "bg-gray-100 dark:bg-white/10")} />
                                    ))}
                                </div>
                                <p className={cn("text-xs font-medium",
                                    strength >= 3 ? "text-success-600" : strength === 2 ? "text-warning-500" : "text-error-500")}>
                                    {strengthLabel}
                                </p>
                            </div>
                        )}

                        <FormInput
                            label="Confirm Password" id="confirm" type="password"
                            required placeholder="Repeat password" {...field("confirm")}
                            rightElement={form.confirm && form.password === form.confirm
                                ? <Check className="h-4 w-4 text-success-500" /> : undefined}
                        />

                        <button type="submit" disabled={isPending}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-sm font-semibold text-white hover:bg-primary-700 hover:shadow-glow transition-all active:scale-[0.98] disabled:opacity-60 mt-2">
                            {isPending
                                ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                : <><UserPlus className="h-4 w-4" /> Create Account</>}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
