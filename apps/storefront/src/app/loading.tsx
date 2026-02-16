import { Skeleton, ProductGridSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <div className="animate-fade-in">
            {/* Hero skeleton */}
            <div className="bg-gray-100 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-32">
                    <Skeleton className="h-8 w-48 mb-6" />
                    <Skeleton className="h-16 w-96 max-w-full mb-4" />
                    <Skeleton className="h-16 w-72 max-w-full mb-6" />
                    <Skeleton className="h-6 w-80 max-w-full mb-8" />
                    <div className="flex gap-4">
                        <Skeleton className="h-14 w-40" />
                        <Skeleton className="h-14 w-48" />
                    </div>
                </div>
            </div>
            {/* Products skeleton */}
            <div className="mx-auto max-w-7xl px-4 py-16">
                <Skeleton className="h-10 w-64 mx-auto mb-4" />
                <Skeleton className="h-5 w-96 max-w-full mx-auto mb-12" />
                <ProductGridSkeleton count={8} />
            </div>
        </div>
    );
}
