"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ShoppingBag, Truck, Clock, Sparkles } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Price } from "./Price"
import { Rating } from "./Rating"
import { useCart } from "~/hooks/useCart"
import { toast } from "sonner"

interface QuickViewDialogProps {
    product: {
        id: string
        name: string
        description: string
        price: number
        image: string | null
        occasion: string
    } | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function QuickViewDialog({ product, open, onOpenChange }: QuickViewDialogProps) {
    const addItem = useCart((state) => state.addItem)
    const prefersReducedMotion = useReducedMotion()

    if (!product) return null

    // Mock rating
    const rating = 4.5

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
        })
        toast.success("Added to cart", {
            description: `${product.name} has been added to your cart.`,
        })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl overflow-hidden p-0 rounded-3xl border-0 shadow-2xl">
                <div className="grid md:grid-cols-2">
                    {/* Image with subtle animation */}
                    <motion.div
                        initial={prefersReducedMotion ? {} : { opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="relative aspect-square md:aspect-auto bg-muted"
                    >
                        <Image
                            src={product.image || "https://2lcifuj23a.ufs.sh/f/7mwewDydS8QMjWc9ubBQFa39zYTI6ZLMgsqoDXWvHbV10xUn"}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                        <Badge
                            variant="glass"
                            className="absolute left-4 top-4 capitalize"
                        >
                            {product.occasion.toLowerCase()}
                        </Badge>
                    </motion.div>

                    {/* Info with staggered content */}
                    <div className="flex flex-col p-8 bg-card">
                        <motion.div
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="mb-6"
                        >
                            <DialogTitle className="mb-3 font-serif text-3xl font-bold leading-tight">
                                {product.name}
                            </DialogTitle>
                            <div className="flex items-center gap-4">
                                <Price value={product.price} size="lg" />
                                <div className="flex items-center gap-1.5">
                                    <Rating value={rating} size="sm" />
                                    <span className="text-xs text-muted-foreground">(24 reviews)</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.p
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.5 }}
                            className="mb-8 text-muted-foreground leading-relaxed"
                        >
                            {product.description}
                        </motion.p>

                        <motion.div
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="mb-8 space-y-3"
                        >
                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage/10">
                                    <Truck className="h-4 w-4 text-sage" />
                                </div>
                                <span>Same day delivery available</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blush/10">
                                    <Clock className="h-4 w-4 text-blush" />
                                </div>
                                <span>Order by 2pm for immediate delivery</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                </div>
                                <span>Hand-crafted with premium blooms</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.5 }}
                            className="mt-auto flex flex-col gap-3"
                        >
                            <Button size="lg" variant="premium" className="w-full rounded-xl" onClick={handleAddToCart}>
                                <ShoppingBag className="mr-2 h-5 w-5" />
                                Add to Cart
                            </Button>
                            <Button variant="outline" size="lg" className="w-full rounded-xl" asChild>
                                <Link href={`/products/${product.id}`} onClick={() => onOpenChange(false)}>
                                    View Full Details
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
