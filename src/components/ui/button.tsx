import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow-bloom hover:shadow-bloom-lg hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:-translate-y-0.5 active:translate-y-0",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent hover:-translate-y-0.5 active:translate-y-0",
                secondary:
                    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:-translate-y-0.5 active:translate-y-0",
                ghost:
                    "hover:bg-accent hover:text-accent-foreground",
                link:
                    "text-primary underline-offset-4 hover:underline",
                premium:
                    "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-bloom hover:shadow-glow hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-transform before:duration-700 hover:before:translate-x-full",
                glass:
                    "bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 text-foreground hover:bg-white/20 dark:hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0",
            },
            size: {
                default: "h-11 px-6 py-2.5",
                sm: "h-9 rounded-lg px-4 text-xs",
                lg: "h-14 rounded-2xl px-10 text-base font-semibold",
                xl: "h-16 rounded-2xl px-12 text-lg font-semibold",
                icon: "h-11 w-11 rounded-xl",
                "icon-sm": "h-9 w-9 rounded-lg",
                "icon-lg": "h-14 w-14 rounded-2xl",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
