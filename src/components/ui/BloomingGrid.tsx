"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface BloomingGridProps {
    children: ReactNode;
    staggerDelay?: number;
    triggerOffset?: number;
    className?: string;
}

/**
 * BloomingGrid Component
 * 
 * Wrapper that applies Anime.js stagger bloom animation to children on scroll.
 * Features organic spring physics for award-winning motion design.
 * 
 * @param staggerDelay - Delay between each item in ms (default: 150)
 * @param triggerOffset - Intersection Observer threshold (default: 0.2)
 */
export function BloomingGrid({
    children,
    staggerDelay = 150,
    triggerOffset = 0.2,
    className = "",
}: BloomingGridProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || hasAnimated) return;

        const observer = new IntersectionObserver(
            async (entries) => {
                if (entries[0]?.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);

                    try {
                        const anime = (await import("animejs")).default;
                        const items = container.querySelectorAll(".bloom-item");

                        anime({
                            targets: items,
                            scale: [0.85, 1],
                            opacity: [0, 1],
                            translateY: [50, 0],
                            delay: anime.stagger(staggerDelay),
                            easing: "spring(1, 80, 10, 0)",
                            duration: 1000,
                        });
                    } catch (error) {
                        console.warn("Anime.js bloom animation failed:", error);
                        // Fallback: just show items
                        const items = container.querySelectorAll(".bloom-item");
                        items.forEach((item) => {
                            (item as HTMLElement).style.opacity = "1";
                            (item as HTMLElement).style.transform = "none";
                        });
                    }

                    observer.disconnect();
                }
            },
            { threshold: triggerOffset }
        );

        observer.observe(container);

        return () => observer.disconnect();
    }, [hasAnimated, staggerDelay, triggerOffset]);

    return (
        <div ref={containerRef} className={className}>
            {children}
        </div>
    );
}
