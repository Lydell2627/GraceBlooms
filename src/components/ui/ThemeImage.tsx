"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "~/lib/utils";

interface ThemeImageProps {
    lightSrc: string;
    darkSrc?: string;
    alt: string;
    priority?: boolean;
    className?: string;
    sizes?: string;
    fill?: boolean;
    width?: number;
    height?: number;
    quality?: number;
}

/**
 * ThemeImage Component
 * 
 * Smart next/image wrapper optimized for 4K floral assets with theme-aware loading.
 * Features:
 * - Automatic theme-based source selection
 * - Smooth cross-fade on theme transitions
 * - Performance-optimized with Next.js Image
 * - 4K-ready size defaults
 */
export function ThemeImage({
    lightSrc,
    darkSrc,
    alt,
    priority = false,
    className = "",
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 3840px",
    fill = false,
    width,
    height,
    quality = 90,
}: ThemeImageProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent flash during SSR
    if (!mounted) {
        return (
            <div className={cn("bg-muted", className)} />
        );
    }

    const theme = resolvedTheme || "light";

    if (fill) {
        return (
            <div className="relative w-full h-full">
                {lightSrc && (
                    <Image
                        src={lightSrc}
                        alt={alt}
                        fill
                        priority={priority}
                        sizes={sizes}
                        quality={quality}
                        className={cn(
                            "object-cover transition-opacity duration-500",
                            theme === "light" ? "opacity-100" : "opacity-0"
                        )}
                    />
                )}
                <Image
                    src={darkSrc ?? lightSrc}
                    alt={alt}
                    fill
                    priority={priority}
                    sizes={sizes}
                    quality={quality}
                    className={cn(
                        "object-cover transition-opacity duration-500",
                        theme === "dark" ? "opacity-100" : "opacity-0"
                    )}
                />
            </div>
        );
    }

    const src = theme === "dark" ? (darkSrc ?? lightSrc) : lightSrc;

    return (
        <Image
            src={src}
            alt={alt}
            width={width || 1920}
            height={height || 1080}
            priority={priority}
            sizes={sizes}
            quality={quality}
            className={cn("transition-opacity duration-500", className)}
        />
    );
}
