"use client";

import * as React from "react";
import { Button, ButtonProps } from "~/components/ui/button";
import { useMagneticButton } from "~/hooks/useMagneticButton";
import { cn } from "~/lib/utils";

interface MagneticButtonProps extends ButtonProps {
    magnetRadius?: number;
    magnetStrength?: number;
}

/**
 * MagneticButton Component
 * 
 * Premium "Get Started" / CTA button with magnetic cursor attraction.
 * Wraps the shadcn Button with physics-based interaction.
 */
export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
    ({ className, magnetRadius = 50, magnetStrength = 0.5, ...props }, forwardedRef) => {
        const magnetRef = useMagneticButton<HTMLButtonElement>({
            radius: magnetRadius,
            strength: magnetStrength
        });

        // Merge refs
        const setRefs = React.useCallback(
            (node: HTMLButtonElement | null) => {
                magnetRef.current = node;
                if (typeof forwardedRef === 'function') {
                    forwardedRef(node);
                } else if (forwardedRef) {
                    forwardedRef.current = node;
                }
            },
            [forwardedRef, magnetRef]
        );

        return (
            <Button
                ref={setRefs}
                className={cn("transition-transform will-change-transform", className)}
                {...props}
            />
        );
    }
);

MagneticButton.displayName = "MagneticButton";
