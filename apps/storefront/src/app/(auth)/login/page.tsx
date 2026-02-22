"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { loginCustomer } from "@/lib/medusa/actions/auth";
import { cn } from "@/lib/utils/cn";

// ─── Reusable input ────────────────────────────────────────────────────────────
function FormInput({
    label, id, type = "text", required, placeholder, value, onChange,
    rightElement, error
}: {
    label: string; id: string; type?: string; required?: boolean;
    placeholder?: string; value: string;
    onChange: (val: string) => void;
    rightElement?: React.ReactNode;
    error?: string;
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
                        error
                            ? "border-error-500"
                            : "border-gray-200 dark:border-white/10",
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

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }
        setError(null);
        startTransition(async () => {
            const result = await loginCustomer(email, password);
            if (result.success) {
                router.push("/account");
                router.refresh();
            } else {
                setError(result.error ?? "Invalid email or password.");
            }
        });
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md animate-slide-up">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/30">
                        <LogIn className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Sign in to your Naman Ent account
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-surface-dark-secondary shadow-elevated p-8">
                    {error && (
                        <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-error-500/30 bg-error-500/10 px-4 py-3 text-sm text-error-600 dark:text-error-400 animate-slide-down">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <FormInput
                            label="Email Address" id="email" type="email"
                            required placeholder="you@example.com"
                            value={email} onChange={setEmail}
                        />
                        <FormInput
                            label="Password" id="password"
                            type={showPw ? "text" : "password"}
                            required placeholder="••••••••"
                            value={password} onChange={setPassword}
                            rightElement={
                                <button type="button" onClick={() => setShowPw((v) => !v)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            }
                        />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-600 dark:text-gray-300 cursor-pointer">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                Remember me
                            </label>
                            <Link href="#" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                                Forgot password?
                            </Link>
                        </div>

                        <button type="submit" disabled={isPending}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-sm font-semibold text-white hover:bg-primary-700 hover:shadow-glow transition-all active:scale-[0.98] disabled:opacity-60">
                            {isPending
                                ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                : <><LogIn className="h-4 w-4" /> Sign In</>}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">
                            Create one <ArrowRight className="inline h-3 w-3" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
