import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/utils/seo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export const metadata: Metadata = createMetadata({
    title: "Sign In",
    description: "Sign in to your Naman Ent account to manage orders and preferences.",
    url: "/login",
    noIndex: true,
});

export default function LoginPage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Sign in to your account to continue shopping
                    </p>
                </div>

                <div className="bg-white dark:bg-surface-dark-secondary rounded-2xl shadow-card border border-gray-200/60 dark:border-gray-700/60 p-8">
                    <form className="space-y-5" action="#">
                        <Input label="Email Address" type="email" placeholder="you@example.com" required />
                        <Input label="Password" type="password" placeholder="••••••••" required />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                Remember me
                            </label>
                            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" className="w-full" size="lg">
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                            Create one
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
