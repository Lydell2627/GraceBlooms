import { cn } from "~/lib/utils";

interface PriceProps {
    value: number;
    currency?: string;
    originalPrice?: number;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function Price({
    value,
    currency = "$",
    originalPrice,
    size = "md",
    className,
}: PriceProps) {
    const sizeClasses = {
        sm: "text-sm",
        md: "text-lg",
        lg: "text-2xl",
    };

    const hasDiscount = originalPrice && originalPrice > value;

    return (
        <div className={cn("flex items-baseline gap-2", className)}>
            <span
                className={cn(
                    "font-bold text-foreground",
                    sizeClasses[size]
                )}
            >
                {currency}
                {value.toFixed(2)}
            </span>
            {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                    {currency}
                    {originalPrice.toFixed(2)}
                </span>
            )}
        </div>
    );
}
