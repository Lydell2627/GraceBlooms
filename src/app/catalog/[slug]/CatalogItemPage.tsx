"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Phone, Mail, ChevronLeft, Truck, Palette, Calendar, Sparkles, Share2, Heart } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { ProductCard } from "~/components/product/ProductCard";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { toast } from "sonner";
import { useCurrency } from "~/app/_components/CurrencyProvider";

interface CatalogItemPageProps {
    slug: string;
}

export function CatalogItemPage({ slug }: CatalogItemPageProps) {
    const prefersReducedMotion = useReducedMotion();
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const [isWishlisted, setIsWishlisted] = React.useState(false);
    const { formatRange } = useCurrency();

    const item = useQuery(api.catalog.getBySlug, { slug });
    const settings = useQuery(api.settings.get, {});
    const relatedItems = useQuery(
        api.catalog.getRelated,
        item ? { itemId: item._id, limit: 4 } : "skip"
    );

    const isLoading = item === undefined;

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32">
                    <div className="grid gap-12 lg:grid-cols-2">
                        <div className="aspect-square rounded-3xl bg-muted animate-pulse" />
                        <div className="space-y-4">
                            <div className="h-8 w-2/3 rounded bg-muted animate-pulse" />
                            <div className="h-6 w-1/3 rounded bg-muted animate-pulse" />
                            <div className="h-24 rounded bg-muted animate-pulse" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!item) {
        return (
            <main className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 text-center">
                    <div className="mb-4 text-6xl">🌸</div>
                    <h1 className="font-serif text-3xl font-bold mb-4">Item Not Found</h1>
                    <p className="text-muted-foreground mb-6">
                        This arrangement may no longer be available.
                    </p>
                    <Button asChild>
                        <Link href="/catalog">Browse Catalog</Link>
                    </Button>
                </div>
                <Footer />
            </main>
        );
    }

    const priceDisplay = item.priceMin === item.priceMax
        ? formatRange(item.priceMin, item.priceMin).split(" - ")[0]
        : formatRange(item.priceMin, item.priceMax);

    const whatsappMessage = encodeURIComponent(
        `Hi! I'd like to order "${item.title}" (${priceDisplay}). Can you help me with the process?`
    );
    const whatsappLink = `https://wa.me/${settings?.whatsappNumber || "919876543210"}?text=${whatsappMessage}`;

    const mainImage = item.images?.[currentImageIndex] || item.images?.[0] || "https://2lcifuj23a.ufs.sh/f/7mwewDydS8QMjWc9ubBQFa39zYTI6ZLMgsqoDXWvHbV10xUn";

    const handleShare = async () => {
        try {
            await navigator.share({
                title: item.title,
                text: item.shortDescription,
                url: window.location.href,
            });
        } catch {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        }
    };

    const handleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    };

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 sm:pb-16">
                {/* Breadcrumb */}
                <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link
                        href="/catalog"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Catalog
                    </Link>
                </motion.div>

                <div className="grid gap-12 lg:grid-cols-2">
                    {/* Image Gallery */}
                    <motion.div
                        initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        {/* Main Image */}
                        <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted">
                            <Image
                                src={mainImage}
                                alt={item.title}
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* Category & Tags */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                <Badge variant="glass" className="capitalize">
                                    {item.category.toLowerCase()}
                                </Badge>
                                {item.tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant={tag === "featured" ? "default" : "secondary"}
                                        className="capitalize text-xs"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="rounded-full bg-white/90 hover:bg-white"
                                    onClick={handleShare}
                                >
                                    <Share2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className={`rounded-full ${isWishlisted ? "bg-blush/20 text-blush" : "bg-white/90"} hover:bg-white`}
                                    onClick={handleWishlist}
                                >
                                    <Heart className={`h-4 w-4 ${isWishlisted && "fill-current"}`} />
                                </Button>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {item.images.length > 1 && (
                            <div className="flex gap-3">
                                {item.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${idx === currentImageIndex
                                            ? "border-primary ring-2 ring-primary/20"
                                            : "border-transparent opacity-70 hover:opacity-100"
                                            }`}
                                    >
                                        <Image src={img} alt="" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Details */}
                    <motion.div
                        initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="flex flex-col"
                    >
                        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                            {item.title}
                        </h1>

                        <div className="text-3xl font-bold text-primary mb-6">
                            {priceDisplay}
                        </div>

                        <p className="text-muted-foreground leading-relaxed mb-8">
                            {item.description}
                        </p>

                        <Separator className="mb-8" />

                        {/* Features */}
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/10">
                                    <Truck className="h-5 w-5 text-sage" />
                                </div>
                                <div>
                                    <p className="font-medium">
                                        {item.leadTimeDays === 1 ? "Same Day Delivery" : `${item.leadTimeDays || 2} Day Lead Time`}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {item.leadTimeDays === 1 ? "Order by 2pm for delivery today" : "Standard processing time"}
                                    </p>
                                </div>
                            </div>

                            {item.customizationAvailable && (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blush/10">
                                        <Palette className="h-5 w-5 text-blush" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Customization Available</p>
                                        <p className="text-sm text-muted-foreground">
                                            Contact us to personalize this arrangement
                                        </p>
                                    </div>
                                </div>
                            )}

                            {item.deliveryNotes && (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Delivery Notes</p>
                                        <p className="text-sm text-muted-foreground">{item.deliveryNotes}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Premium Quality</p>
                                    <p className="text-sm text-muted-foreground">
                                        Hand-crafted with the freshest blooms
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact CTAs */}
                        <div className="space-y-3 mt-auto">
                            <Button size="lg" className="w-full rounded-xl bg-green-600 hover:bg-green-500" asChild>
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="mr-2 h-5 w-5" />
                                    WhatsApp to Order
                                </a>
                            </Button>

                            <div className="grid grid-cols-2 gap-3">
                                <Button size="lg" variant="outline" className="rounded-xl" asChild>
                                    <a href={`tel:${settings?.phoneNumber || "+919876543210"}`}>
                                        <Phone className="mr-2 h-4 w-4" />
                                        Call Us
                                    </a>
                                </Button>
                                <Button size="lg" variant="outline" className="rounded-xl" asChild>
                                    <Link href="/contact">
                                        <Mail className="mr-2 h-4 w-4" />
                                        Email Us
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Related Items */}
            {relatedItems && relatedItems.length > 0 && (
                <section className="py-16 bg-muted/30">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal>
                            <h2 className="font-serif text-3xl font-bold mb-8">
                                You May Also Like
                            </h2>
                        </ScrollReveal>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedItems.map((related, i) => (
                                <ScrollReveal key={related._id} delay={i * 0.1}>
                                    <ProductCard
                                        product={{
                                            id: related._id,
                                            title: related.title,
                                            slug: related.slug,
                                            shortDescription: related.shortDescription,
                                            description: related.description,
                                            priceMin: related.priceMin,
                                            priceMax: related.priceMax,
                                            currency: related.currency,
                                            category: related.category,
                                            tags: related.tags,
                                            images: related.images,
                                            customizationAvailable: related.customizationAvailable,
                                            leadTimeDays: related.leadTimeDays,
                                            deliveryNotes: related.deliveryNotes,
                                        }}
                                    />
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </main>
    );
}
