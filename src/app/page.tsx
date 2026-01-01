"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Truck, Sparkles, Shield, Star, ChevronDown, User } from "lucide-react";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { ProductCard } from "~/components/product/ProductCard";
import { QuickViewDialog } from "~/components/product/QuickViewDialog";
import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { FloatingShape } from "~/components/ui/floating-element";
import { useAuth } from "~/app/_components/AuthProvider";
import { cn } from "~/lib/utils";

const occasions = [
    "Wedding",
    "Birthday",
    "Anniversary",
    "Sympathy",
    "Thank You",
    "Just Because",
];

const collections = [
    {
        title: "Wedding",
        img: "/wedding-collection.png",
        count: "12 Items",
        description: "Elegant arrangements for your special day",
    },
    {
        title: "Anniversary",
        img: "/anniversary-collection.png",
        count: "8 Items",
        description: "Celebrate milestones with classic beauty",
    },
    {
        title: "Sympathy",
        img: "/sympathy-collection.png",
        count: "15 Items",
        description: "Heartfelt tributes that honor memories",
    },
];

const valueProps = [
    {
        icon: Sparkles,
        title: "Freshness Guaranteed",
        description: "Sourced directly from local growers to ensure your blooms last longer.",
    },
    {
        icon: Truck,
        title: "Same Day Delivery",
        description: "Order by 2PM for immediate delivery to brighten someone's day.",
    },
    {
        icon: Shield,
        title: "Artist Arrangements",
        description: "Each bouquet is hand-crafted by our award-winning floral designers.",
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

export default function Home() {
    const prefersReducedMotion = useReducedMotion();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [quickViewProduct, setQuickViewProduct] = React.useState<any>(null);

    // Fetch dynamic products from Convex
    const products = useQuery(api.products.list, {});
    const isLoadingProducts = products === undefined;

    // Get 4 featured products for the homepage
    const featuredProducts = products?.slice(0, 4) || [];

    return (
        <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Navbar />

            {/* Hero Section - Cinematic */}
            <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
                {/* Background Image with subtle zoom */}
                <motion.div
                    initial={prefersReducedMotion ? {} : { scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src="/hero-bg.png"
                        alt="Beautiful floral arrangement"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
                </motion.div>

                {/* Grain Overlay */}
                <div className="grain-overlay absolute inset-0 z-[1]" />

                {/* Floating Decorative Elements */}
                <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
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
                <div className="container relative z-10 mx-auto px-6 text-center">
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

                        {/* Headline with staggered words */}
                        <motion.h1
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="mb-8 font-serif text-5xl font-bold leading-[1.1] text-white md:text-7xl lg:text-8xl"
                        >
                            Emotions in
                            <br />
                            <span className="italic text-primary">Full Bloom</span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="mx-auto mb-10 max-w-2xl text-lg text-white/80 md:text-xl leading-relaxed"
                        >
                            Hand-crafted arrangements that speak the language of the heart.
                            <br className="hidden sm:block" />
                            Delivered fresh to your doorstep, same day.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
                        >
                            <Button size="lg" variant="premium" asChild className="min-w-[200px]">
                                <Link href="/products">
                                    Shop Collections
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            {!authLoading && (
                                isAuthenticated && user ? (
                                    <Button
                                        size="lg"
                                        variant="glass"
                                        className="min-w-[200px] text-white"
                                        asChild
                                    >
                                        <Link href="/profile">
                                            <User className="mr-2 h-4 w-4" />
                                            My Account
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button
                                        size="lg"
                                        variant="glass"
                                        className="min-w-[200px] text-white"
                                        asChild
                                    >
                                        <Link href="/sign-up">Join Our Community</Link>
                                    </Button>
                                )
                            )}
                        </motion.div>

                        {/* Occasion Chips */}
                        <motion.div
                            initial={prefersReducedMotion ? {} : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.6 }}
                            className="flex flex-wrap items-center justify-center gap-2"
                        >
                            {occasions.map((occasion, index) => (
                                <motion.div
                                    key={occasion}
                                    initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1 + index * 0.05, duration: 0.4 }}
                                >
                                    <Link
                                        href={`/products?category=${occasion.toLowerCase().replace(" ", "-")}`}
                                    >
                                        <Badge
                                            variant="glass"
                                            className="cursor-pointer px-4 py-1.5 text-white/90 transition-all hover:bg-white/20"
                                        >
                                            {occasion}
                                        </Badge>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                    className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
                >
                    <motion.div
                        animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="flex flex-col items-center gap-2 text-white/60"
                    >
                        <span className="text-xs uppercase tracking-widest">Discover</span>
                        <ChevronDown className="h-4 w-4" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Featured Collections */}
            <section className="py-24 lg:py-32">
                <div className="container mx-auto px-6">
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
                                    href={`/products?category=${item.title.toLowerCase()}`}
                                    className="group relative block h-[500px] overflow-hidden rounded-3xl"
                                >
                                    <Image
                                        src={item.img}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-700 ease-premium group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
                                    <div className="absolute bottom-0 left-0 p-8 text-white">
                                        <Badge variant="glass" className="mb-3 text-white/80">
                                            {item.count}
                                        </Badge>
                                        <h3 className="font-serif text-3xl font-bold">{item.title}</h3>
                                        <p className="mt-2 text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                            {item.description}
                                        </p>
                                    </div>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Signature Series - Dynamic Products */}
            <section className="bg-muted/30 py-24 lg:py-32">
                <div className="container mx-auto px-6">
                    <ScrollReveal>
                        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="max-w-2xl">
                                <h2 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                                    Signature Series
                                </h2>
                                <div className="mb-4 h-1 w-24 rounded-full bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                                <p className="text-muted-foreground">
                                    Our most popular handcrafted arrangements, delivered same-day.
                                </p>
                            </div>
                            <Button variant="outline" asChild className="hidden md:flex">
                                <Link href="/products">
                                    View All Blooms
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </ScrollReveal>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {isLoadingProducts ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="aspect-[4/5] rounded-3xl bg-muted animate-pulse" />
                                    <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
                                    <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
                                </div>
                            ))
                        ) : (
                            featuredProducts.map((product, i) => (
                                <ScrollReveal key={product._id} delay={i * 0.1}>
                                    <ProductCard
                                        product={{
                                            id: product._id,
                                            name: product.name,
                                            description: product.description,
                                            price: product.price,
                                            image: product.image || null,
                                            occasion: product.occasion,
                                        }}
                                        onQuickView={(p) => setQuickViewProduct(p)}
                                    />
                                </ScrollReveal>
                            ))
                        )}
                    </div>

                    <div className="mt-12 flex justify-center md:hidden">
                        <Button variant="outline" asChild className="w-full">
                            <Link href="/products">
                                View Full Collection
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Value Props */}
            <section className="py-24" id="about">
                <div className="container mx-auto px-6">
                    <div className="grid gap-8 md:grid-cols-3">
                        {valueProps.map((prop, i) => (
                            <ScrollReveal key={i} delay={i * 0.1}>
                                <div className="group rounded-3xl border bg-card p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-bloom">
                                    <motion.div
                                        whileHover={prefersReducedMotion ? {} : { scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                                    >
                                        <prop.icon className="h-7 w-7" />
                                    </motion.div>
                                    <h3 className="mb-3 font-serif text-xl font-bold">{prop.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{prop.description}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="bg-foreground py-24 text-background">
                <div className="container mx-auto px-6">
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
                                        "{testimonial.quote}"
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

            {/* Newsletter */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <ScrollReveal>
                        <div className="mx-auto max-w-2xl rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 p-12 text-center border border-primary/10">
                            <h2 className="mb-4 font-serif text-3xl font-bold">Stay in Bloom</h2>
                            <p className="mb-8 text-muted-foreground">
                                Subscribe to our newsletter for exclusive offers, care tips, and
                                flower of the month features.
                            </p>
                            <form className="flex flex-col gap-4 sm:flex-row">
                                <Input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="flex-1"
                                />
                                <Button type="submit">Subscribe</Button>
                            </form>
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
