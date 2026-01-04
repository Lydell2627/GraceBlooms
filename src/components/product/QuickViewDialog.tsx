"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { MessageCircle, Phone, Mail, Truck, Clock, Sparkles, Palette, Calendar } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"

interface CatalogItem {
    id: string
    title: string
    slug: string
    shortDescription: string
    description: string
    priceMin: number
    priceMax: number
    currency: string
    category: string
    tags: string[]
    images: string[]
    customizationAvailable?: boolean
    leadTimeDays?: number
    deliveryNotes?: string
}

interface QuickViewDialogProps {
    product: CatalogItem | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function QuickViewDialog({ product, open, onOpenChange }: QuickViewDialogProps) {
    const prefersReducedMotion = useReducedMotion()
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0)

    if (!product) return null

    // Format price range
    const priceDisplay = product.priceMin === product.priceMax
        ? `₹${product.priceMin.toLocaleString("en-IN")}`
        : `₹${product.priceMin.toLocaleString("en-IN")}–₹${product.priceMax.toLocaleString("en-IN")}`

    // Generate WhatsApp message
    const whatsappMessage = encodeURIComponent(
        `Hi! I'm interested in "${product.title}" (${priceDisplay}). Can you help me with more details and order?`
    )
    const whatsappLink = `https://wa.me/919876543210?text=${whatsappMessage}`

    const mainImage = product.images?.[currentImageIndex] || product.images?.[0] || "https://2lcifuj23a.ufs.sh/f/7mwewDydS8QMjWc9ubBQFa39zYTI6ZLMgsqoDXWvHbV10xUn"

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl border-0 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Image with subtle animation */}
                    <motion.div
                        initial={prefersReducedMotion ? {} : { opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="relative aspect-square md:aspect-auto bg-muted"
                    >
                        <Image
                            src={mainImage}
                            alt={product.title}
                            fill
                            className="object-cover"
                        />
                        <Badge
                            variant="glass"
                            className="absolute left-4 top-4 capitalize"
                        >
                            {product.category.toLowerCase()}
                        </Badge>

                        {/* Image thumbnails if multiple */}
                        {product.images.length > 1 && (
                            <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center">
                                {product.images.slice(0, 4).map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex ? "border-white scale-110" : "border-transparent opacity-70"
                                            }`}
                                    >
                                        <Image src={img} alt="" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Tags */}
                        {product.tags.length > 0 && (
                            <div className="absolute right-4 top-4 flex flex-col gap-1">
                                {product.tags.slice(0, 2).map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant={tag === "featured" ? "default" : tag === "new" ? "sage" : "secondary"}
                                        className="text-xs capitalize"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Info with staggered content */}
                    <div className="flex flex-col p-4 sm:p-6 md:p-8 bg-card">
                        <motion.div
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="mb-4"
                        >
                            <DialogTitle className="mb-3 font-serif text-3xl font-bold leading-tight">
                                {product.title}
                            </DialogTitle>
                            <div className="flex items-center gap-4">
                                <span className="text-2xl font-bold text-primary">
                                    {priceDisplay}
                                </span>
                            </div>
                        </motion.div>

                        <motion.p
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.5 }}
                            className="mb-6 text-muted-foreground leading-relaxed"
                        >
                            {product.description || product.shortDescription}
                        </motion.p>

                        <motion.div
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="mb-6 space-y-3"
                        >
                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage/10">
                                    <Truck className="h-4 w-4 text-sage" />
                                </div>
                                <span>
                                    {product.leadTimeDays === 1
                                        ? "Same day delivery available"
                                        : `${product.leadTimeDays || 2} day lead time`}
                                </span>
                            </div>
                            {product.customizationAvailable && (
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blush/10">
                                        <Palette className="h-4 w-4 text-blush" />
                                    </div>
                                    <span>Customization available</span>
                                </div>
                            )}
                            {product.deliveryNotes && (
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                        <Calendar className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-muted-foreground">{product.deliveryNotes}</span>
                                </div>
                            )}
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
                            {/* Primary CTA - WhatsApp */}
                            <Button size="lg" className="w-full rounded-xl bg-green-600 hover:bg-green-500" asChild>
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="mr-2 h-5 w-5" />
                                    WhatsApp to Order
                                </a>
                            </Button>

                            {/* Secondary CTAs */}
                            <div className="flex gap-2">
                                <Button variant="outline" size="lg" className="flex-1 rounded-xl" asChild>
                                    <a href="tel:+919876543210">
                                        <Phone className="mr-2 h-4 w-4" />
                                        Call
                                    </a>
                                </Button>
                                <Button variant="outline" size="lg" className="flex-1 rounded-xl" asChild>
                                    <Link href="/contact" onClick={() => onOpenChange(false)}>
                                        <Mail className="mr-2 h-4 w-4" />
                                        Email
                                    </Link>
                                </Button>
                            </div>

                            {/* View Details */}
                            <Button variant="ghost" size="lg" className="w-full rounded-xl" asChild>
                                <Link href={`/catalog/${product.slug}`} onClick={() => onOpenChange(false)}>
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
