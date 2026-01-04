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
 */
export function LenisProvider({ children }: LenisProviderProps) {
    useEffect(() => {
        let lenis: any;

        const initLenis = async () => {
            try {
                const Lenis = (await import("@studio-freight/lenis")).default;

                lenis = new Lenis({
                    duration: 0.8,
                    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    orientation: "vertical",
                    gestureOrientation: "vertical",
                    smoothWheel: true,
                    wheelMultiplier: 1.3,
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
