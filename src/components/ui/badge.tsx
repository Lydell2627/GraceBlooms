import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300 ease-premium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-bloom",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "text-foreground border-border hover:bg-accent hover:text-accent-foreground",
                sage:
                    "border-transparent bg-sage/15 text-sage dark:bg-sage/25",
                blush:
                    "border-transparent bg-blush/15 text-blush dark:bg-blush/25",
                glass:
                    "border-white/20 bg-white/10 dark:bg-white/5 backdrop-blur-sm text-foreground",
                premium:
                    "border-transparent bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground backdrop-blur-sm",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
