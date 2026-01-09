"use client";

import { useEffect, useState } from "react";
import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

interface PerformanceSettings {
    enableParallax: boolean;
    enableComplexAnimations: boolean;
    animationQuality: "high" | "medium" | "low";
    respectReducedMotion: boolean;
}

/**
 * usePerformance Hook
 * 
 * Detects system performance capabilities and adjusts animations accordingly.
 * Ensures smooth experience across all devices while maintaining visual appeal.
 */
export function usePerformance(): PerformanceSettings {
    const prefersReducedMotion = useFramerReducedMotion();
    const [settings, setSettings] = useState<PerformanceSettings>({
        enableParallax: true,
        enableComplexAnimations: true,
        animationQuality: "high",
        respectReducedMotion: !!prefersReducedMotion,
    });

    useEffect(() => {
        // Respect user's motion preferences
        if (prefersReducedMotion) {
            setSettings({
                enableParallax: false,
                enableComplexAnimations: false,
                animationQuality: "low",
                respectReducedMotion: true,
            });
            return;
        }

        // Detect device capabilities
        const detectPerformance = () => {
            let quality: "high" | "medium" | "low" = "high";
            let enableParallax = true;
            let enableComplexAnimations = true;

            // Check for mobile devices - they handle differently
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            // Check hardware concurrency (CPU cores)
            const cores = navigator.hardwareConcurrency || 4;

            // Check device memory (if available)
            const memory = (navigator as any).deviceMemory || 8;

            // Performance heuristics
            if (isMobile) {
                // Mobile: Disable parallax, keep other animations
                enableParallax = false;
                quality = cores >= 6 ? "high" : "medium";
            } else {
                // Desktop: Check capabilities
                if (cores < 4 || memory < 4) {
                    quality = "medium";
                    enableParallax = true; // Keep but will use lower intensity
                } else if (cores >= 8 && memory >= 8) {
                    quality = "high";
                    enableParallax = true;
                } else {
                    quality = "medium";
                    enableParallax = true;
                }
            }

            // FPS monitoring (simplified)
            let lastTime = performance.now();
            let frames = 0;
            const checkFPS = () => {
                frames++;
                const currentTime = performance.now();
                if (currentTime >= lastTime + 1000) {
                    const fps = Math.round((frames * 1000) / (currentTime - lastTime));

                    // If FPS drops below 55, reduce quality
                    if (fps < 55 && quality === "high") {
                        quality = "medium";
                        setSettings((prev) => ({
                            ...prev,
                            animationQuality: "medium",
                        }));
                    }

                    frames = 0;
                    lastTime = currentTime;
                }

                // Only monitor for first 5 seconds
                if (currentTime < lastTime + 5000) {
                    requestAnimationFrame(checkFPS);
                }
            };
            requestAnimationFrame(checkFPS);

            setSettings({
                enableParallax,
                enableComplexAnimations,
                animationQuality: quality,
                respectReducedMotion: false,
            });
        };

        detectPerformance();
    }, [prefersReducedMotion]);

    return settings;
}

/**
 * Get parallax intensity based on performance settings
 */
export function getParallaxIntensity(quality: "high" | "medium" | "low"): number {
    switch (quality) {
        case "high":
            return 0.4;
        case "medium":
            return 0.25;
        case "low":
            return 0;
        default:
            return 0.25;
    }
}
