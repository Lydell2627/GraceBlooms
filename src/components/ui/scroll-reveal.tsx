"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "~/lib/utils";

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    distance?: number;
    once?: boolean;
}

/**
 * ScrollReveal - Animate elements when they enter the viewport
 * Respects reduced motion preferences automatically
 */
export function ScrollReveal({
    children,
    className,
    delay = 0,
    duration = 0.6,
    direction = "up",
    distance = 24,
    once = true,
}: ScrollRevealProps) {
    const prefersReducedMotion = useReducedMotion();

    const directionOffset = {
        up: { y: distance },
        down: { y: -distance },
        left: { x: distance },
        right: { x: -distance },
        none: {},
    };

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={cn(className)}
            initial={{
                opacity: 0,
                ...directionOffset[direction],
            }}
            whileInView={{
                opacity: 1,
                x: 0,
                y: 0,
            }}
            viewport={{ once, margin: "-50px" }}
            transition={{
                duration,
                delay,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {children}
        </motion.div>
    );
}
