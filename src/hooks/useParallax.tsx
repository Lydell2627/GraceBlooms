"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/**
 * useParallax Hook (Optimized)
 * 
 * Creates smooth GSAP parallax scroll effect with performance optimizations.
 * - Uses smoother scrubbing to prevent jitter
 * - Only animates when element is in viewport
 * - Adjusts intensity based on performance
 * 
 * @param speed - Parallax speed multiplier (0.5 = slower, 1.5 = faster)
 * @param enabled - Whether parallax is enabled (controlled by performance settings)
 * @returns React ref to attach to the parallax element
 */
export function useParallax<T extends HTMLElement>(
    speed: number = 0.5,
    enabled: boolean = true
) {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (!ref.current || !enabled) return;

        const element = ref.current;

        // Add will-change hint for browser optimization
        element.style.willChange = "transform";

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: element,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2, // Smoother scrubbing (was true, now 1.2s delay for smoothness)
                invalidateOnRefresh: true,
                // Only update when element is in view
                toggleActions: "play none none reverse",
            },
        });

        tl.to(element, {
            y: () => window.innerHeight * speed,
            ease: "none",
            force3D: true, // Force GPU acceleration
        });

        return () => {
            // Clean up will-change
            element.style.willChange = "auto";
            tl.kill();
            ScrollTrigger.getAll().forEach((trigger) => {
                if (trigger.vars.trigger === element) {
                    trigger.kill();
                }
            });
        };
    }, [speed, enabled]);

    return ref;
}

