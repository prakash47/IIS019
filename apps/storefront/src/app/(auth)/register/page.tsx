import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/utils/seo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export const metadata: Metadata = createMetadata({
    title: "Create Account",
    description: "Create a Naman Ent account to start shopping premium products.",
    url: "/register",
    noIndex: true,
});

export default function RegisterPage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                        Create Account
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Join Naman Ent for exclusive deals and faster checkout
                    </p>
                </div>

                <div className="bg-white dark:bg-surface-dark-secondary rounded-2xl shadow-card border border-gray-200/60 dark:border-gray-700/60 p-8">
                    <form className="space-y-5" action="#">
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="First Name" placeholder="John" required />
                            <Input label="Last Name" placeholder="Doe" required />
                        </div>
                        <Input label="Email Address" type="email" placeholder="you@example.com" required />
                        <Input label="Password" type="password" placeholder="••••••••" required />
                        <Input label="Confirm Password" type="password" placeholder="••••••••" required />

                        <Button type="submit" className="w-full" size="lg">
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
