"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "~/lib/utils";

interface FloatingElementProps {
    children?: React.ReactNode;
    className?: string;
    duration?: number;
    delay?: number;
    distance?: number;
    rotation?: number;
}

/**
 * FloatingElement - Decorative floating animation wrapper
 * Creates a gentle, organic floating motion for visual elements
 */
export function FloatingElement({
    children,
    className,
    duration = 6,
    delay = 0,
    distance = 15,
    rotation = 3,
}: FloatingElementProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={cn(className)}
            animate={{
                y: [0, -distance, 0],
                rotate: [0, rotation, -rotation, 0],
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        >
            {children}
        </motion.div>
    );
}

/**
 * FloatingShape - Pre-styled decorative floating shapes
 */
interface FloatingShapeProps {
    variant?: "circle" | "blob" | "ring" | "petal";
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
    color?: "primary" | "secondary" | "muted";
    duration?: number;
    delay?: number;
}

export function FloatingShape({
    variant = "circle",
    size = "md",
    className,
    color = "primary",
    duration = 6,
    delay = 0,
}: FloatingShapeProps) {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-16 h-16",
        lg: "w-24 h-24",
        xl: "w-32 h-32",
    };

    const colorClasses = {
        primary: "bg-primary/10 dark:bg-primary/20",
        secondary: "bg-secondary/10 dark:bg-secondary/20",
        muted: "bg-muted-foreground/5",
    };

    const variantClasses = {
        circle: "rounded-full",
        blob: "rounded-[60%_40%_30%_70%/60%_30%_70%_40%]",
        ring: "rounded-full border-2 border-primary/20 bg-transparent",
        petal: "rounded-[80%_20%_55%_45%/55%_45%_80%_20%]",
    };

    return (
        <FloatingElement
            duration={duration}
            delay={delay}
            distance={variant === "ring" ? 8 : 12}
            rotation={variant === "blob" ? 5 : 2}
        >
            <div
                className={cn(
                    sizeClasses[size],
                    colorClasses[color],
                    variantClasses[variant],
                    "blur-sm",
                    className
                )}
            />
        </FloatingElement>
    );
}
