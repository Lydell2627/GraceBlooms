"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Search,
    Flower2,
    TrendingUp,
    ShoppingBag,
    Heart,
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "~/components/ui/command"
import { useQuery } from "convex/react"
import { api } from "~/convex/_generated/api"
import { Badge } from "~/components/ui/badge"

export function CommandPalette() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()
    const products = useQuery(api.products.list, {})

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="group flex items-center gap-2.5 rounded-xl bg-muted/60 px-4 py-2 text-sm text-muted-foreground transition-all hover:bg-muted border border-transparent hover:border-border/50"
            >
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline-block">Search flowers...</span>
                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded-md border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem
                            onSelect={() => runCommand(() => router.push("/products"))}
                        >
                            <Flower2 className="mr-2 h-4 w-4" />
                            <span>Browse All Flowers</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push("/#collections"))}
                        >
                            <TrendingUp className="mr-2 h-4 w-4" />
                            <span>Trending Collections</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Products">
                        {products?.map((product) => (
                            <CommandItem
                                key={product._id}
                                onSelect={() => runCommand(() => router.push(`/products/${product._id}`))}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    <span>{product.name}</span>
                                </div>
                                <Badge variant="secondary" className="text-[10px] uppercase tracking-wider opacity-50">
                                    {product.occasion}
                                </Badge>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Occasions">
                        <CommandItem onSelect={() => runCommand(() => router.push("/products?occasion=WEDDING"))}>
                            <Heart className="mr-2 h-4 w-4" />
                            <span>Wedding</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/products?occasion=BIRTHDAY"))}>
                            <Smile className="mr-2 h-4 w-4" />
                            <span>Birthday</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
