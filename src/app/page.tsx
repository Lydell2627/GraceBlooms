"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Truck, Shield, Star, MessageCircle, Phone, Mail } from "lucide-react";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { MagneticButton } from "~/components/ui/MagneticButton";
import { BloomingGrid } from "~/components/ui/BloomingGrid";
import { ThemeImage } from "~/components/ui/ThemeImage";
import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { ProductCard } from "~/components/product/ProductCard";
import { QuickViewDialog } from "~/components/product/QuickViewDialog";
import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { FloatingShape } from "~/components/ui/floating-element";
import { WavesBackground } from "~/components/ui/waves-background";
import { ShinyText } from "~/components/ui/shiny-text";
import { useParallax } from "~/hooks/useParallax";

const occasions = [
    { name: "Wedding", category: "wedding" },
    { name: "Birthday", category: "birthday" },
    { name: "Anniversary", category: "anniversary" },
    { name: "Sympathy", category: "sympathy" },
    { name: "Custom", category: "custom" },
];

const collections = [
    {
        title: "Wedding",
        img: "https://2lcifuj23a.ufs.sh/f/7mwewDydS8QMgz19w4ualML4DajYpfn8mBi1RTGIFctgOHro",
        description: "Elegant arrangements for your special day",
        category: "wedding",
    },
    {
        title: "Anniversary",
        img: "https://2lcifuj23a.ufs.sh/f/7mwewDydS8QMP6rqR2S4CqkKBeOpjAJhMcQ0IZSFi3xlE4sU",
        description: "Celebrate milestones with classic beauty",
        category: "anniversary",
    },
    {
        title: "Sympathy",
        img: "https://2lcifuj23a.ufs.sh/f/7mwewDydS8QMyQeZhG7opIwWKlVO4xCf0dFXALQ7JUBujHkz",
        description: "Heartfelt tributes that honor memories",
        category: "sympathy",
    },
];

const testimonials = [
    {
        quote: "The flowers I ordered for my wife's birthday were absolutely breathtaking. They stayed fresh for almost two weeks!",
        author: "James Peterson",
        role: "Loyal Customer",
        rating: 5,
    },
    {
        quote: "Best florist in the city. The wedding arrangements exceeded all expectations.",
        author: "Sarah Mitchell",
        role: "Bride",
        rating: 5,
    },
    {
        quote: "Their attention to detail and care instructions made all the difference.",
        author: "Michael Chen",
        role: "Regular Customer",
        rating: 5,
    },
];

// Type for catalog items from Convex
interface CatalogItem {
    _id: string;
    title: string;
    slug: string;
    shortDescription: string;
    description: string;
    priceMin: number;
    priceMax: number;
    currency: string;
    category: string;
    tags: string[];
    images: string[];
    customizationAvailable?: boolean;
    leadTimeDays?: number;
    deliveryNotes?: string;
    published: boolean;
}

// Type for ProductCard component
interface ProductItem {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    description: string;
    priceMin: number;
    priceMax: number;
    currency: string;
    category: string;
    tags: string[];
    images: string[];
    customizationAvailable?: boolean;
    leadTimeDays?: number;
    deliveryNotes?: string;
}

// Transform Convex item to ProductCard format
function toProductCardItem(item: CatalogItem): ProductItem {
    return {
        id: item._id,
        title: item.title,
        slug: item.slug,
        shortDescription: item.shortDescription || "",
        description: item.description || "",
        priceMin: item.priceMin,
        priceMax: item.priceMax,
        currency: item.currency,
        category: item.category,
        tags: item.tags,
        images: item.images,
        customizationAvailable: item.customizationAvailable,
        leadTimeDays: item.leadTimeDays,
        deliveryNotes: item.deliveryNotes,
    };
}

export default function Home() {
    const prefersReducedMotion = useReducedMotion();
    const [quickViewProduct, setQuickViewProduct] = React.useState<ReturnType<typeof toProductCardItem> | null>(null);

    // Parallax refs for hero layers
    const heroBackgroundRef = useParallax<HTMLDivElement>(0.5); // Slower parallax for background

    // Fetch dynamic data from Convex
    const featuredItems = useQuery(api.catalog.getFeatured, { limit: 4 });
    const settings = useQuery(api.settings.get, {});

    const isLoadingProducts = featuredItems === undefined;

    // Default values from settings or fallbacks
    const heroHeadline = settings?.heroHeadline || "Emotions in Full Bloom";
    const heroSubheadline = settings?.heroSubheadline || "Hand-crafted arrangements that speak the language of the heart. Contact us to order.";
    const trustBadges = settings?.trustBadges || [
        { icon: "Sparkles", title: "Freshness Guaranteed", description: "Sourced directly from local growers" },
        { icon: "Truck", title: "Same Day Delivery", description: "Order by 2PM for immediate delivery" },
        { icon: "Shield", title: "Artist Arrangements", description: "Hand-crafted by award-winning designers" },
    ];

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "Sparkles": return Sparkles;
            case "Truck": return Truck;
            case "Shield": return Shield;
            default: return Sparkles;
        }
    };

    // WhatsApp link
    const whatsappMessage = encodeURIComponent("Hi! I'd like to inquire about your floral arrangements.");
    const whatsappLink = `https://wa.me/${settings?.whatsappNumber || "919876543210"}?text=${whatsappMessage}`;

    return (
        <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Navbar />

            {/* Hero Section - Cinematic */}
            <section className="relative flex min-h-screen items-center justify-center overflow-hidden pb-16 sm:pb-0">
                {/* Background Image with parallax and theme-aware 4K sources */}
                <motion.div
                    ref={heroBackgroundRef}
                    initial={prefersReducedMotion ? {} : { scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 z-0 will-change-transform"
                >
                    <ThemeImage
                        lightSrc="https://2lcifuj23a.ufs.sh/f/7mwewDydS8QM5cnd4yUj4at0SrcIVxTMmfYzNpQnWXGdAHsF"
                        darkSrc="https://2lcifuj23a.ufs.sh/f/7mwewDydS8QM5cnd4yUj4at0SrcIVxTMmfYzNpQnWXGdAHsF"
                        alt="Beautiful floral arrangement"
                        priority
                        fill
                        sizes="100vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
                </motion.div>

                {/* Grain Overlay */}
                <div className="grain-overlay absolute inset-0 z-[1]" />

                {/* Waves Animation Background */}
                <WavesBackground
                    className="z-[2]"
                    colors={[
                        "rgba(232, 213, 196, 0.08)",  // Terracotta
                        "rgba(163, 177, 138, 0.08)",  // Sage
                        "rgba(244, 172, 183, 0.08)",  // Petal Pink
                    ]}
                    speed={25}
                />

                {/* Floating Decorative Elements */}
                <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
                    <FloatingShape
                        variant="blob"
                        size="xl"
                        color="primary"
                        className="absolute top-20 left-10 opacity-20"
                        delay={0}
                    />
                    <FloatingShape
                        variant="circle"
                        size="lg"
                        color="secondary"
                        className="absolute bottom-40 right-20 opacity-15"
                        delay={2}
                    />
                    <FloatingShape
                        variant="petal"
                        size="md"
                        color="primary"
                        className="absolute top-1/3 right-1/4 opacity-10"
                        delay={4}
                    />
                </div>

                {/* Content */}
                <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 sm:pt-0">
                    <motion.div
                        initial={prefersReducedMotion ? {} : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="mx-auto max-w-4xl"
                    >
                        {/* Pre-headline */}
                        <motion.span
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="mb-6 inline-block rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium uppercase tracking-widest text-white/90 backdrop-blur-sm border border-white/10"
                        >
                            Est. 2024 — Artisanal Flower Boutique
                        </motion.span>

                        {/* Headline */}
                        <motion.h1
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="mb-6 sm:mb-8 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.15] text-white"
                        >
                            {heroHeadline.split(" ").slice(0, -2).join(" ")}
                            <br />
                            <ShinyText className="italic text-primary text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                                {heroHeadline.split(" ").slice(-2).join(" ")}
                            </ShinyText>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="mx-auto mb-8 sm:mb-10 max-w-2xl text-base sm:text-lg md:text-xl text-white/80 leading-relaxed px-2"
                        >
                            {heroSubheadline}
                        </motion.p>

                        {/* Primary CTA Buttons - Magnetic */}
                        <motion.div
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="mb-8 sm:mb-12 flex flex-col items-center justify-center gap-4 px-4 sm:px-0 sm:flex-row"
                        >
                            <MagneticButton
                                size="lg"
                                magnetRadius={60}
                                magnetStrength={0.4}
                                className="w-full sm:w-auto sm:min-w-[220px] text-lg h-14 bg-green-600 hover:bg-green-500 shadow-lg hover:shadow-xl transition-all"
                                asChild
                            >
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="mr-2 h-5 w-5" />
                                    Order via WhatsApp
                                </a>
                            </MagneticButton>
                            <MagneticButton
                                size="lg"
                                variant="glass"
                                magnetRadius={60}
                                magnetStrength={0.4}
                                className="w-full sm:w-auto sm:min-w-[220px] text-lg h-14 text-white border-white/20 hover:bg-white/10"
                                asChild
                            >
                                <Link href="/catalog">
                                    Browse Catalog
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </MagneticButton>
                        </motion.div>

                        {/* Occasion Chips */}
                        <motion.div
                            initial={prefersReducedMotion ? {} : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.6 }}
                            className="flex flex-wrap items-center justify-center gap-3 px-4 sm:px-0"
                        >
                            {occasions.map((occasion, index) => (
                                <motion.div
                                    key={occasion.name}
                                    initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1 + index * 0.05, duration: 0.4 }}
                                >
                                    <Link href={`/catalog?category=${occasion.category}`}>
                                        <Badge
                                            variant="glass"
                                            className="cursor-pointer px-5 py-2 text-sm font-medium text-white/90 transition-all hover:bg-white/20 hover:scale-105 backdrop-blur-md border-white/20"
                                        >
                                            {occasion.name}
                                        </Badge>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Collections */}
            <section className="py-24 lg:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                                Curated Collections
                            </h2>
                            <div className="mx-auto mb-4 h-1 w-24 rounded-full bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                            <p className="mx-auto max-w-2xl text-muted-foreground">
                                Discover our most loved arrangements, perfect for every moment.
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="grid gap-8 md:grid-cols-3">
                        {collections.map((item, i) => (
                            <ScrollReveal key={i} delay={i * 0.15}>
                                <Link
                                    href={`/catalog?category=${item.category}`}
                                    className="group relative block h-[500px] overflow-hidden rounded-3xl"
                                >
                                    <Image
                                        src={item.img}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                                        loading="lazy"
                                        className="object-cover transition-transform duration-700 ease-premium group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
                                    <div className="absolute bottom-0 left-0 p-8 text-white">
                                        <h3 className="font-serif text-3xl font-bold">{item.title}</h3>
                                        <p className="mt-2 text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                            {item.description}
                                        </p>
                                        <Button variant="glass" size="sm" className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            View Collection
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Arrangements */}
            <section className="bg-muted/30 py-24 lg:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="max-w-2xl">
                                <h2 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                                    Featured Arrangements
                                </h2>
                                <div className="mb-4 h-1 w-24 rounded-full bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                                <p className="text-muted-foreground">
                                    Our most popular handcrafted bouquets. Contact us to order.
                                </p>
                            </div>
                            <Button variant="outline" asChild className="hidden md:flex">
                                <Link href="/catalog">
                                    View Full Catalog
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </ScrollReveal>

                    <BloomingGrid
                        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
                        staggerDelay={120}
                        triggerOffset={0.15}
                    >
                        {isLoadingProducts ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="space-y-4 bloom-item">
                                    <div className="aspect-[4/5] rounded-3xl bg-muted animate-pulse" />
                                    <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
                                    <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
                                </div>
                            ))
                        ) : (
                            featuredItems?.map((item) => (
                                <div key={item._id} className="bloom-item">
                                    <ProductCard
                                        product={toProductCardItem(item)}
                                        onQuickView={(p) => setQuickViewProduct(p)}
                                    />
                                </div>
                            ))
                        )}
                    </BloomingGrid>

                    <div className="mt-12 flex justify-center md:hidden">
                        <Button variant="outline" asChild className="w-full">
                            <Link href="/catalog">
                                View Full Catalog
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Value Props / Trust Badges */}
            <section className="py-24" id="about">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 md:grid-cols-3">
                        {trustBadges.map((prop, i) => {
                            const Icon = getIcon(prop.icon);
                            return (
                                <ScrollReveal key={i} delay={i * 0.1}>
                                    <div className="group rounded-3xl border bg-card p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-bloom">
                                        <motion.div
                                            whileHover={prefersReducedMotion ? {} : { scale: 1.1, rotate: 5 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                            className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                                        >
                                            <Icon className="h-7 w-7" />
                                        </motion.div>
                                        <h3 className="mb-3 font-serif text-xl font-bold">{prop.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">{prop.description}</p>
                                    </div>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="bg-foreground py-24 text-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                                What Our Customers Say
                            </h2>
                            <p className="mx-auto max-w-2xl text-background/70">
                                Trusted by thousands of happy customers across the country.
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="grid gap-8 md:grid-cols-3">
                        {testimonials.map((testimonial, i) => (
                            <ScrollReveal key={i} delay={i * 0.1}>
                                <div className="rounded-3xl border border-background/10 bg-background/5 p-8 backdrop-blur-sm">
                                    <div className="mb-4 flex gap-1">
                                        {Array.from({ length: testimonial.rating }).map((_, j) => (
                                            <Star
                                                key={j}
                                                className="h-4 w-4 fill-amber-400 text-amber-400"
                                            />
                                        ))}
                                    </div>
                                    <blockquote className="mb-6 text-lg font-medium leading-relaxed">
                                        &ldquo;{testimonial.quote}&rdquo;
                                    </blockquote>
                                    <div>
                                        <p className="font-bold">{testimonial.author}</p>
                                        <p className="text-sm text-background/60">{testimonial.role}</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA Section */}
            <section className="py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 p-12 text-center border border-primary/10">
                            <h2 className="mb-4 font-serif text-3xl font-bold">Ready to Order?</h2>
                            <p className="mb-8 text-muted-foreground max-w-xl mx-auto">
                                Contact us via WhatsApp, phone, or email to discuss your floral needs.
                                We&apos;ll help you create the perfect arrangement.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <MagneticButton size="lg" magnetRadius={70} magnetStrength={0.5} className="bg-green-600 hover:bg-green-500" asChild>
                                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                        <MessageCircle className="mr-2 h-5 w-5" />
                                        WhatsApp Us
                                    </a>
                                </MagneticButton>
                                <MagneticButton size="lg" variant="outline" magnetRadius={70} magnetStrength={0.5} asChild>
                                    <a href={`tel:${settings?.phoneNumber || "+919876543210"}`}>
                                        <Phone className="mr-2 h-4 w-4" />
                                        Call Now
                                    </a>
                                </MagneticButton>
                                <MagneticButton size="lg" variant="outline" magnetRadius={70} magnetStrength={0.5} asChild>
                                    <Link href="/contact">
                                        <Mail className="mr-2 h-4 w-4" />
                                        Email Us
                                    </Link>
                                </MagneticButton>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Footer */}
            <Footer />

            <QuickViewDialog
                product={quickViewProduct}
                open={!!quickViewProduct}
                onOpenChange={(open) => !open && setQuickViewProduct(null)}
            />
        </main>
    );
}
