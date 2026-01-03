"use client";

import * as React from "react";
import { useRef, useEffect } from "react";
import { cn } from "~/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
    spotlightColor?: string;
    spotlightOpacity?: number;
    children: React.ReactNode;
}

/**
 * SpotlightCard - React Bits inspired component
 * Features a spotlight beam that follows mouse movement
 * Configured with coral red (#FA6868) for Obsidian Garden theme
 */
export function SpotlightCard({
    spotlightColor = "250, 104, 104", // Coral Red RGB
    spotlightOpacity = 0.1,
    children,
    className,
    ...props
}: SpotlightCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = React.useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!cardRef.current) return;

            const card = cardRef.current;
            const rect = card.getBoundingClientRect();

            setMousePosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        };

        const handleMouseEnter = () => setIsHovered(true);
        const handleMouseLeave = () => setIsHovered(false);

        const card = cardRef.current;
        if (card) {
            card.addEventListener("mousemove", handleMouseMove);
            card.addEventListener("mouseenter", handleMouseEnter);
            card.addEventListener("mouseleave", handleMouseLeave);
        }

        return () => {
            if (card) {
                card.removeEventListener("mousemove", handleMouseMove);
                card.removeEventListener("mouseenter", handleMouseEnter);
                card.removeEventListener("mouseleave", handleMouseLeave);
            }
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className={cn("relative overflow-hidden", className)}
            {...props}
        >
            {/* Spotlight overlay */}
            <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(
            600px circle at ${mousePosition.x}px ${mousePosition.y}px,
            rgba(${spotlightColor}, ${spotlightOpacity}),
            transparent 40%
          )`,
                }}
            />

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    );
}
