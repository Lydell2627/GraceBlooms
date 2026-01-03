"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { cn } from "~/lib/utils";

interface ShinyTextProps {
    children: string;
    className?: string;
    shimmerWidth?: number;
    shimmerDuration?: number;
}

/**
 * Text with animated shimmer/shine effect
 * Perfect for CTAs and headings
 */
export function ShinyText({
    children,
    className,
    shimmerWidth = 100,
    shimmerDuration = 3,
}: ShinyTextProps) {
    const textRef = useRef<HTMLSpanElement>(null);

    return (
        <span
            ref={textRef}
            className={cn("relative inline-block", className)}
            style={{
                background: `linear-gradient(
          90deg,
          currentColor 0%,
          currentColor 40%,
          rgba(255, 255, 255, 0.8) 50%,
          currentColor 60%,
          currentColor 100%
        )`,
                backgroundSize: `${shimmerWidth * 2}% 100%`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundPosition: "-${shimmerWidth}% 0",
                animation: `shimmer ${shimmerDuration}s ease-in-out infinite`,
            }}
        >
            {children}
            <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -${shimmerWidth}% 0;
          }
          50%, 100% {
            background-position: ${shimmerWidth}% 0;
          }
        }
      `}</style>
        </span>
    );
}

/**
 * Text with gradient animation
 * Alternative shiny effect
 */
export function GradientText({
    children,
    className,
    from = "from-primary",
    via = "via-accent",
    to = "to-secondary",
}: {
    children: string;
    className?: string;
    from?: string;
    via?: string;
    to?: string;
}) {
    return (
        <span
            className={cn(
                "bg-gradient-to-r bg-clip-text text-transparent",
                from,
                via,
                to,
                "animate-gradient",
                className
            )}
            style={{
                backgroundSize: "200% auto",
            }}
        >
            {children}
            <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
        </span>
    );
}
