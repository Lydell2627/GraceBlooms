"use client";

import * as React from "react";

/**
 * SVG Floral Loader with animated growth effect
 * Inspired by blooming flowers
 */
export function FloralLoader({
    className = "",
    size = 48,
}: {
    className?: string;
    size?: number;
}) {
    return (
        <div className={`relative ${className}`} style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="animate-spin"
                style={{ animationDuration: "3s" }}
            >
                {/* Center circle */}
                <circle
                    cx="50"
                    cy="50"
                    r="8"
                    fill="currentColor"
                    className="text-primary opacity-80"
                />

                {/* Petals - animated with stagger */}
                {[0, 60, 120, 180, 240, 300].map((rotation, index) => (
                    <g
                        key={rotation}
                        transform={`rotate(${rotation} 50 50)`}
                        style={{
                            animation: `bloom 2s ease-in-out infinite`,
                            animationDelay: `${index * 0.15}s`,
                        }}
                    >
                        <ellipse
                            cx="50"
                            cy="25"
                            rx="12"
                            ry="20"
                            fill="currentColor"
                            className="text-primary"
                            opacity="0.6"
                        />
                    </g>
                ))}
            </svg>

            {/* CSS for bloom animation */}
            <style jsx>{`
        @keyframes bloom {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
}

/**
 * Minimal loading spinner variant
 */
export function FloralSpinner({
    className = "",
    size = 24,
}: {
    className?: string;
    size?: number;
}) {
    return (
        <div
            className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
            style={{
                width: size,
                height: size,
            }}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
}
