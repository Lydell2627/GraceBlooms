import { Truck, Clock } from "lucide-react";
import { cn } from "~/lib/utils";

interface DeliveryBadgeProps {
    type?: "same-day" | "next-day" | "standard";
    className?: string;
}

export function DeliveryBadge({
    type = "standard",
    className,
}: DeliveryBadgeProps) {
    const config = {
        "same-day": {
            icon: Truck,
            text: "Same Day Delivery",
            bgClass: "bg-sage/10 text-sage dark:bg-sage/20",
        },
        "next-day": {
            icon: Clock,
            text: "Next Day Delivery",
            bgClass: "bg-blush/10 text-blush dark:bg-blush/20",
        },
        standard: {
            icon: Truck,
            text: "2-3 Day Delivery",
            bgClass: "bg-muted text-muted-foreground",
        },
    };

    const { icon: Icon, text, bgClass } = config[type];

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                bgClass,
                className
            )}
        >
            <Icon className="h-3 w-3" />
            {text}
        </div>
    );
}
