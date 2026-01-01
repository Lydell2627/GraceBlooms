"use client";

import { Star } from "lucide-react";
import { cn } from "~/lib/utils";

interface RatingProps {
    value: number;
    max?: number;
    size?: "sm" | "md" | "lg";
    showValue?: boolean;
    className?: string;
}

export function Rating({
    value,
    max = 5,
    size = "md",
    showValue = false,
    className,
}: RatingProps) {
    const sizeClasses = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
    };

    const stars = Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(value);
        const partial = !filled && i < value;

        return (
            <Star
                key={i}
                className={cn(
                    sizeClasses[size],
                    "transition-colors",
                    filled
                        ? "fill-amber-400 text-amber-400"
                        : partial
                            ? "fill-amber-400/50 text-amber-400"
                            : "fill-muted text-muted"
                )}
            />
        );
    });

    return (
        <div className={cn("flex items-center gap-0.5", className)}>
            {stars}
            {showValue && (
                <span className="ml-1.5 text-sm font-medium text-muted-foreground">
                    {value.toFixed(1)}
                </span>
            )}
        </div>
    );
}
