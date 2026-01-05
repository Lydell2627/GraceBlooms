"use client";

import * as React from "react";
import Link from "next/link";
import { Flower2, Mail, MapPin, Phone, Instagram, Twitter, Facebook } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const footerLinks = {
    shop: [
        { label: "All Products", href: "/products" },
        { label: "Wedding", href: "/products?category=wedding" },
        { label: "Birthday", href: "/products?category=birthday" },
        { label: "Sympathy", href: "/products?category=sympathy" },
    ],
    company: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Flower Care", href: "/chat" },
        { label: "Privacy Policy", href: "/privacy" },
    ],
    social: [
        { label: "Instagram", href: "#", icon: Instagram },
        { label: "Twitter", href: "#", icon: Twitter },
        { label: "Facebook", href: "#", icon: Facebook },
    ],
};

export function Footer() {
    const settings = useQuery(api.settings.get, {});
    const prefersReducedMotion = useReducedMotion();
    const [email, setEmail] = React.useState("");
    const [subscribed, setSubscribed] = React.useState(false);

    // Dynamic contact info from settings
    const contactEmail = settings?.email || "hello@graceblooms.com";
    const contactPhone = settings?.phoneNumber || "+91 98765 43210";
    const location = settings?.location || "123 Flower District, City - 400001";

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail("");
        }
    };

    return (
        <footer className="relative border-t bg-card">
            {/* Decorative gradient */}
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="container mx-auto px-6 py-16 lg:py-20">
                <div className="grid gap-12 lg:grid-cols-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 font-serif text-2xl font-bold tracking-tight"
                        >
                            <Flower2 className="h-7 w-7 text-primary" />
                            <span>
                                Grace <span className="italic text-primary">Blooms</span>
                            </span>
                        </Link>
                        <p className="mt-4 max-w-xs leading-relaxed text-muted-foreground">
                            Bringing nature's beauty to your special moments. Rooted in quality, grown with love.
                        </p>

                        {/* Contact Info */}
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>{location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 text-primary" />
                                <span>{contactPhone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 text-primary" />
                                <span>{contactEmail}</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="mt-6 flex gap-3">
                            {footerLinks.social.map((social) => (
                                <Button
                                    key={social.label}
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary"
                                    asChild
                                >
                                    <a href={social.href} aria-label={social.label}>
                                        <social.icon className="h-5 w-5" />
                                    </a>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="grid gap-8 sm:grid-cols-2 lg:col-span-4">
                        <div>
                            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">
                                Shop
                            </h4>
                            <ul className="space-y-3">
                                {footerLinks.shop.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="group inline-flex items-center text-muted-foreground transition-colors hover:text-primary"
                                        >
                                            <span className="relative">
                                                {link.label}
                                                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">
                                Company
                            </h4>
                            <ul className="space-y-3">
                                {footerLinks.company.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="group inline-flex items-center text-muted-foreground transition-colors hover:text-primary"
                                        >
                                            <span className="relative">
                                                {link.label}
                                                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <div className="lg:col-span-4">
                        <div className="rounded-2xl bg-muted/50 p-6">
                            <h4 className="mb-2 font-serif text-xl font-bold">Stay in Bloom</h4>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Subscribe for exclusive offers and flower care tips.
                            </p>
                            {subscribed ? (
                                <motion.div
                                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 rounded-xl bg-sage/10 p-4 text-sage"
                                >
                                    <Flower2 className="h-5 w-5" />
                                    <span className="text-sm font-medium">Thank you for subscribing!</span>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubscribe} className="flex gap-2">
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex-1"
                                        required
                                    />
                                    <Button type="submit" className="shrink-0">
                                        Subscribe
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Grace Blooms. All rights reserved.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Crafted with{" "}
                        <span className="text-primary">♥</span> for flower lovers
                    </p>
                </div>
            </div>
        </footer>
    );
}
