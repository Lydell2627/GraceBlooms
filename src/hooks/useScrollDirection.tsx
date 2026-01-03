"use client";

import { useEffect, useState, useRef } from "react";

export type ScrollDirection = "up" | "down" | "static";

/**
 * useScrollDirection Hook
 * 
 * Detects scroll direction for implementing hide/show navbar behavior.
 * Returns "up" | "down" | "static"
 */
export function useScrollDirection() {
    const [scrollDirection, setScrollDirection] = useState<ScrollDirection>("static");
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    useEffect(() => {
        const updateScrollDirection = () => {
            const scrollY = window.scrollY;

            if (Math.abs(scrollY - lastScrollY.current) < 10) {
                ticking.current = false;
                return;
            }

            if (scrollY > lastScrollY.current && scrollY > 100) {
                setScrollDirection("down");
            } else if (scrollY < lastScrollY.current) {
                setScrollDirection("up");
            }

            lastScrollY.current = scrollY > 0 ? scrollY : 0;
            ticking.current = false;
        };

        const onScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(updateScrollDirection);
                ticking.current = true;
            }
        };

        window.addEventListener("scroll", onScroll);

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return scrollDirection;
}
