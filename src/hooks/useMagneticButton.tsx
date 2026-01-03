"use client";

import { useEffect, useRef, MutableRefObject } from "react";

interface MagneticButtonOptions {
    radius?: number;
    strength?: number;
    duration?: number;
}

/**
 * useMagneticButton Hook
 * 
 * Creates magnetic cursor attraction effect for premium buttons.
 * Uses requestAnimationFrame for smooth performance.
 * 
 * @param radius - Attraction range in pixels (default: 50)
 * @param strength - Pull force multiplier (default: 0.5)
 * @param duration - Animation duration in ms (default: 600)
 */
export function useMagneticButton<T extends HTMLElement = HTMLButtonElement>(
    options: MagneticButtonOptions = {}
): MutableRefObject<T | null> {
    const { radius = 50, strength = 0.5, duration = 600 } = options;
    const ref = useRef<T | null>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        let rafId: number;
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;

        const lerp = (start: number, end: number, factor: number) => {
            return start + (end - start) * factor;
        };

        const animate = () => {
            currentX = lerp(currentX, targetX, 0.1);
            currentY = lerp(currentY, targetY, 0.1);

            element.style.transform = `translate(${currentX}px, ${currentY}px)`;

            if (Math.abs(currentX - targetX) > 0.1 || Math.abs(currentY - targetY) > 0.1) {
                rafId = requestAnimationFrame(animate);
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distanceX = e.clientX - centerX;
            const distanceY = e.clientY - centerY;
            const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

            if (distance < radius) {
                targetX = distanceX * strength;
                targetY = distanceY * strength;
            } else {
                targetX = 0;
                targetY = 0;
            }

            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(animate);
        };

        const handleMouseLeave = () => {
            targetX = 0;
            targetY = 0;
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(animate);
        };

        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            element.removeEventListener("mousemove", handleMouseMove);
            element.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(rafId);
        };
    }, [radius, strength, duration]);

    return ref;
}
