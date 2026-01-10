"use client";

import { ReactNode } from "react";

interface LenisProviderProps {
    children: ReactNode;
}

/**
 * LenisProvider Component
 * 
 * Smooth scroll disabled - using native browser scrolling for better performance.
 */
export function LenisProvider({ children }: LenisProviderProps) {
    return <>{children}</>;
}
