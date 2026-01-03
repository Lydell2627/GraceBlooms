"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { createMagneticEffect } from "~/lib/anime-utils";
import { cn } from "~/lib/utils";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    strength?: number;
    children: React.ReactNode;
}

/**
 * Button with magnetic hover effect
 * Element follows mouse movement
 */
export function MagneticButton({
    strength = 15,
    className,
    children,
    ...props
}: MagneticButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const button = buttonRef.current;
        if (!button) return;

        const cleanup = createMagneticEffect(button, { strength });

        return cleanup;
    }, [strength]);

    return (
        <button
            ref={buttonRef}
            className={cn(
                "relative inline-flex items-center justify-center transition-transform",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
