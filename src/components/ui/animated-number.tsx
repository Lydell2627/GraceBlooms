"use client";

import * as React from "react";
import { motion, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "~/lib/utils";

interface AnimatedNumberProps {
    value: number;
    className?: string;
    duration?: number;
    formatOptions?: Intl.NumberFormatOptions;
    prefix?: string;
    suffix?: string;
}

/**
 * AnimatedNumber - Smoothly animate number changes with spring physics
 * Perfect for prices, counts, and other dynamic values
 */
export function AnimatedNumber({
    value,
    className,
    duration = 0.8,
    formatOptions,
    prefix = "",
    suffix = "",
}: AnimatedNumberProps) {
    const prefersReducedMotion = useReducedMotion();
    const spring = useSpring(value, {
        mass: 0.8,
        stiffness: 75,
        damping: 15,
        duration: prefersReducedMotion ? 0 : duration * 1000,
    });

    const display = useTransform(spring, (current) => {
        const formatted = new Intl.NumberFormat("en-US", formatOptions).format(
            Math.round(current * 100) / 100
        );
        return `${prefix}${formatted}${suffix}`;
    });

    React.useEffect(() => {
        spring.set(value);
    }, [spring, value]);

    if (prefersReducedMotion) {
        const formatted = new Intl.NumberFormat("en-US", formatOptions).format(value);
        return (
            <span className={className}>
                {prefix}{formatted}{suffix}
            </span>
        );
    }

    return <motion.span className={cn(className)}>{display}</motion.span>;
}
