import * as React from "react";

import { cn } from "~/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-12 w-full rounded-xl border border-input bg-background px-4 py-3 text-base ring-offset-background transition-all duration-300 ease-premium",
                    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
                    "placeholder:text-muted-foreground/60",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-transparent",
                    "hover:border-muted-foreground/30",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "md:text-sm",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

// Premium input variant with glass effect
const InputGlass = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-12 w-full rounded-xl border border-white/20 bg-white/10 dark:bg-black/20 backdrop-blur-md px-4 py-3 text-base ring-offset-background transition-all duration-300 ease-premium",
                    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
                    "placeholder:text-foreground/40",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:border-white/40 focus-visible:bg-white/15 dark:focus-visible:bg-black/30",
                    "hover:bg-white/15 dark:hover:bg-black/25 hover:border-white/30",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "md:text-sm",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
InputGlass.displayName = "InputGlass";

export { Input, InputGlass };
