import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="text-8xl font-display font-bold text-primary-200 dark:text-primary-900 mb-4">
                    404
                </div>
                <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
                    Page Not Found
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    Let&apos;s get you back on track.
                </p>
                <div className="flex gap-3 justify-center">
                    <Link href="/">
                        <Button variant="primary">Go Home</Button>
                    </Link>
                    <Link href="/products">
                        <Button variant="outline">Browse Products</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
