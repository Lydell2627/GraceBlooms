"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

interface ThemeImageProps {
    lightSrc: string;
    darkSrc: string;
    alt: string;
    priority?: boolean;
    className?: string;
    sizes?: string;
    fill?: boolean;
    width?: number;
    height?: number;
}

/**
 * ThemeImage Component
 * 
 * Smart next/image wrapper optimized for 4K floral assets with theme-aware loading.
 * Features:
 * - Automatic theme-based source selection
 * - Smooth 0.6s cross-fade on theme transitions
 * - Performance-optimized with blur placeholders
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
}: ThemeImageProps) {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [imgOpacity, setImgOpacity] = useState(1);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Smooth cross-fade on theme change
    useEffect(() => {
        if (!mounted) return;

        setImgOpacity(0);
        const timer = setTimeout(() => {
            setImgOpacity(1);
        }, 50);

        return () => clearTimeout(timer);
    }, [theme, resolvedTheme, mounted]);

    // Use resolved theme to determine source
    const currentTheme = resolvedTheme || theme;
    const src = currentTheme === "dark" ? darkSrc : lightSrc;

    // Prevent flash during SSR
    if (!mounted) {
        return (
            <div className={className} style={{ background: "var(--muted)" }} />
        );
    }

    const imageProps = {
        src,
        alt,
        priority,
        sizes,
        className: `${className} theme-image-transition`,
        style: { opacity: imgOpacity },
        placeholder: "blur" as const,
        blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q==",
    };

    if (fill) {
        return <Image {...imageProps} fill />;
    }

    return (
        <Image
            {...imageProps}
            width={width || 1920}
            height={height || 1080}
        />
    );
}
