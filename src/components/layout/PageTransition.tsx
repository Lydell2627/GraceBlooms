"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * PageTransition - Smooth page transition wrapper
 * Wraps page content for fade + slide animations on route changes
 */
export function PageTransition({ children, className }: PageTransitionProps) {
    const pathname = usePathname();
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className={cn(className)}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

/**
 * FadeIn - Simple fade-in animation wrapper
 */
interface FadeInProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
}

export function FadeIn({ children, className, delay = 0, duration = 0.5 }: FadeInProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}

/**
 * SlideIn - Slide + fade animation wrapper
 */
interface SlideInProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    direction?: "up" | "down" | "left" | "right";
}

export function SlideIn({
    children,
    className,
    delay = 0,
    duration = 0.5,
    direction = "up",
}: SlideInProps) {
    const prefersReducedMotion = useReducedMotion();

    const directionOffset = {
        up: { y: 30 },
        down: { y: -30 },
        left: { x: 30 },
        right: { x: -30 },
    };

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, ...directionOffset[direction] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}

/**
 * StaggerContainer - Container for staggered child animations
 */
interface StaggerContainerProps {
    children: React.ReactNode;
    className?: string;
    staggerDelay?: number;
}

export function StaggerContainer({
    children,
    className,
    staggerDelay = 0.1,
}: StaggerContainerProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}

/**
 * StaggerItem - Individual item for StaggerContainer
 */
interface StaggerItemProps {
    children: React.ReactNode;
    className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}
