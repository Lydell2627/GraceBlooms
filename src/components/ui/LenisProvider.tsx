"use client";

import { ReactNode, useEffect } from "react";

interface LenisProviderProps {
    children: ReactNode;
}

/**
 * LenisProvider Component
 * 
 * Wraps the app in Lenis smooth scroll with premium momentum feel.
 * Configuration: lerp 0.1 for weighted, award-winning scroll experience.
 * Optimized: Only initializes on desktop for better mobile performance.
 */
export function LenisProvider({ children }: LenisProviderProps) {
    useEffect(() => {
        // Only initialize Lenis on desktop for better mobile performance
        // Mobile devices use native smooth scrolling
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            typeof navigator !== 'undefined' ? navigator.userAgent : ''
        );

        if (isMobile) {
            return; // Skip Lenis on mobile devices
        }

        let lenis: any;

        const initLenis = async () => {
            try {
                const Lenis = (await import("@studio-freight/lenis")).default;

                lenis = new Lenis({
                    duration: 1.0,
                    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    orientation: "vertical",
                    gestureOrientation: "vertical",
                    smoothWheel: true,
                    wheelMultiplier: 1.0,
                    touchMultiplier: 2.0,
                    infinite: false,
                });

                function raf(time: number) {
                    lenis.raf(time);
                    requestAnimationFrame(raf);
                }

                requestAnimationFrame(raf);
            } catch (error) {
                console.warn("Lenis smooth scroll failed to initialize:", error);
            }
        };

        initLenis();

        return () => {
            lenis?.destroy();
        };
    }, []);

    return <>{children}</>;
}
