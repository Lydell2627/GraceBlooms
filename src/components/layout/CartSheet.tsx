"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, Sparkles, Truck } from "lucide-react";

import { useCart } from "~/hooks/useCart";
import { Button } from "~/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "~/components/ui/sheet";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

interface CartSheetProps {
    children: React.ReactNode;
}

export function CartSheet({ children }: CartSheetProps) {
    const [open, setOpen] = React.useState(false);
    const { items, removeItem, total, updateQuantity } = useCart();
    const prefersReducedMotion = useReducedMotion();

    const handleIncrement = (item: typeof items[0]) => {
        updateQuantity(item.id, item.quantity + 1);
    };

    const handleDecrement = (item: typeof items[0]) => {
        updateQuantity(item.id, item.quantity - 1);
    };

    const cartTotal = total();

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="flex w-full flex-col sm:max-w-lg border-l-0 bg-background/95 backdrop-blur-xl">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-3 font-serif text-xl">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            Your Cart
                            {items.length > 0 && (
                                <span className="ml-2 text-sm font-normal text-muted-foreground">
                                    ({items.length} {items.length === 1 ? "item" : "items"})
                                </span>
                            )}
                        </div>
                    </SheetTitle>
                </SheetHeader>

                <AnimatePresence mode="wait">
                    {items.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-1 flex-col items-center justify-center gap-6 text-center"
                        >
                            <motion.div
                                animate={prefersReducedMotion ? {} : { scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="rounded-full bg-muted p-8"
                            >
                                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                            </motion.div>
                            <div>
                                <p className="font-serif text-lg font-medium">Your cart is empty</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Add some beautiful blooms to get started.
                                </p>
                            </div>
                            <Button asChild onClick={() => setOpen(false)} className="rounded-xl">
                                <Link href="/products">Browse Flowers</Link>
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="cart"
                            initial={prefersReducedMotion ? {} : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-1 flex-col"
                        >
                            {/* Free delivery banner */}
                            <motion.div
                                initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 flex items-center gap-2 rounded-2xl bg-sage/10 p-3 text-sm"
                            >
                                <Truck className="h-4 w-4 text-sage" />
                                <span className="text-sage font-medium">Free delivery on all orders!</span>
                            </motion.div>

                            <div className="flex-1 overflow-auto py-2 scrollbar-premium">
                                <div className="space-y-3">
                                    <AnimatePresence initial={false}>
                                        {items.map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                                                transition={{
                                                    delay: index * 0.05,
                                                    type: "spring",
                                                    stiffness: 500,
                                                    damping: 30,
                                                }}
                                                className="flex gap-4 rounded-2xl border bg-card p-4"
                                            >
                                                <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-muted">
                                                    <Image
                                                        src="https://2lcifuj23a.ufs.sh/f/7mwewDydS8QMjWc9ubBQFa39zYTI6ZLMgsqoDXWvHbV10xUn"
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-1 flex-col">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h4 className="font-medium leading-tight line-clamp-1">
                                                                {item.name}
                                                            </h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                ${item.price.toFixed(2)} each
                                                            </p>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                                                            onClick={() => removeItem(item.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="mt-auto flex items-center gap-2">
                                                        <div className="flex items-center rounded-full border bg-muted/50">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-full hover:bg-background"
                                                                onClick={() => handleDecrement(item)}
                                                            >
                                                                <Minus className="h-3 w-3" />
                                                            </Button>
                                                            <span className="w-8 text-center text-sm font-medium">
                                                                {item.quantity}
                                                            </span>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-full hover:bg-background"
                                                                onClick={() => handleIncrement(item)}
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                        <span className="ml-auto font-semibold">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Footer with totals */}
                            <div className="space-y-4 border-t pt-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Delivery</span>
                                        <Badge variant="sage" className="text-xs">Free</Badge>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                                <Button
                                    className="w-full rounded-xl shadow-bloom"
                                    size="lg"
                                    variant="premium"
                                    asChild
                                >
                                    <Link href="/checkout" onClick={() => setOpen(false)}>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Checkout — ${cartTotal.toFixed(2)}
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full rounded-xl"
                                    onClick={() => setOpen(false)}
                                    asChild
                                >
                                    <Link href="/products">Continue Shopping</Link>
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </SheetContent>
        </Sheet>
    );
}
