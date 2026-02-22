"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface GalleryImage {
    id: string;
    url: string;
}

interface ProductGalleryProps {
    images: GalleryImage[];
    title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const hasImages = images.length > 0;
    const activeImage = images[activeIndex];

    const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
    const next = () => setActiveIndex((i) => (i + 1) % images.length);

    return (
        <div className="flex flex-col gap-4">
            {/* ── Main Image ── */}
            <div className="relative aspect-square overflow-hidden rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-surface-dark-tertiary group shadow-card">
                {hasImages ? (
                    <>
                        <Image
                            src={activeImage.url}
                            alt={`${title} — image ${activeIndex + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                            priority
                        />

                        {/* Zoom indicator */}
                        <div className="absolute top-3 right-3 rounded-lg bg-white/80 dark:bg-black/40 backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ZoomIn className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </div>

                        {/* Nav arrows for multiple images */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prev}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-black/60 shadow-elevated hover:bg-white dark:hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                                </button>
                                <button
                                    onClick={next}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-black/60 shadow-elevated hover:bg-white dark:hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                                </button>
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto mb-3 h-24 w-24 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                                <ZoomIn className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                            </div>
                            <p className="text-sm text-gray-400">No image available</p>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Thumbnail Strip ── */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {images.map((img, index) => (
                        <button
                            key={img.id}
                            onClick={() => setActiveIndex(index)}
                            className={cn(
                                "relative h-16 w-16 shrink-0 rounded-lg border-2 overflow-hidden bg-gray-50 dark:bg-surface-dark-tertiary transition-all duration-200",
                                index === activeIndex
                                    ? "border-primary-600 shadow-glow"
                                    : "border-gray-100 dark:border-white/5 hover:border-primary-300 dark:hover:border-primary-700 opacity-70 hover:opacity-100"
                            )}
                            aria-label={`View image ${index + 1}`}
                        >
                            <Image
                                src={img.url}
                                alt={`${title} thumbnail ${index + 1}`}
                                fill
                                sizes="64px"
                                className="object-contain p-1"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
