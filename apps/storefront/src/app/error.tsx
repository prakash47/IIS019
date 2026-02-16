"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-error-500/10 flex items-center justify-center mb-6">
                    <AlertTriangle className="w-8 h-8 text-error-500" />
                </div>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
                    Something went wrong
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    We apologize for the inconvenience. Please try again or contact
                    support if the problem persists.
                </p>
                <div className="flex gap-3 justify-center">
                    <Button onClick={reset} variant="primary">
                        Try Again
                    </Button>
                    <Button onClick={() => (window.location.href = "/")} variant="outline">
                        Go Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
