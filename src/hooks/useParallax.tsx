"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/**
 * useParallax Hook
 * 
 * Creates GSAP parallax scroll effect for specified element.
 * 
 * @param speed - Parallax speed multiplier (0.5 = slower, 1.5 = faster)
 * @returns React ref to attach to the parallax element
 */
export function useParallax<T extends HTMLElement>(speed: number = 0.5) {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: element,
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
        });

        tl.to(element, {
            y: () => window.innerHeight * speed,
            ease: "none",
        });

        return () => {
            tl.kill();
        };
    }, [speed]);

    return ref;
}
