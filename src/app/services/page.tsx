"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Phone, Mail, Heart, Building2, Palette, CalendarDays, Truck, ArrowRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { Button } from "~/components/ui/button";
import { ScrollReveal } from "~/components/ui/scroll-reveal";

const iconMap: Record<string, React.ElementType> = {
    Heart,
    Building2,
    Palette,
    CalendarDays,
    Truck,
};

export default function ServicesPage() {
    const prefersReducedMotion = useReducedMotion();
    const services = useQuery(api.services.list, {});
    const settings = useQuery(api.settings.get, {});

    const isLoading = services === undefined;

    const whatsappMessage = encodeURIComponent("Hi! I'd like to inquire about your services.");
    const whatsappLink = `https://wa.me/${settings?.whatsappNumber || "919876543210"}?text=${whatsappMessage}`;

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-32 pb-20 bg-gradient-to-b from-muted/50 to-background">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Our <span className="italic text-primary">Services</span>
                        </h1>
                        <p className="text-muted-foreground text-lg md:text-xl mb-8 leading-relaxed">
                            From intimate celebrations to grand events, we bring your floral visions to life
                            with artistry and care.
                        </p>

                        {/* Quick Contact */}
                        <div className="flex flex-wrap justify-center gap-3">
                            <Button className="bg-green-600 hover:bg-green-500" asChild>
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    Request a Quote
                                </a>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/contact">
                                    <Mail className="mr-2 h-4 w-4" />
                                    Contact Us
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    {isLoading ? (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="rounded-3xl border bg-card p-8 space-y-4">
                                    <div className="h-16 w-16 rounded-2xl bg-muted animate-pulse" />
                                    <div className="h-6 w-2/3 rounded bg-muted animate-pulse" />
                                    <div className="h-20 rounded bg-muted animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : services && services.length > 0 ? (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {services.map((service, i) => {
                                const Icon = iconMap[service.icon || "Heart"] || Heart;
                                const serviceWhatsapp = encodeURIComponent(
                                    `Hi! I'm interested in your "${service.title}" service. Can you provide more details?`
                                );

                                return (
                                    <ScrollReveal key={service._id} delay={i * 0.1}>
                                        <motion.div
                                            whileHover={prefersReducedMotion ? {} : { y: -8 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            className="group h-full rounded-3xl border bg-card p-8 transition-all duration-500 hover:shadow-bloom"
                                        >
                                            <motion.div
                                                whileHover={prefersReducedMotion ? {} : { scale: 1.1, rotate: 5 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                                className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                                            >
                                                <Icon className="h-7 w-7" />
                                            </motion.div>

                                            <h3 className="font-serif text-2xl font-bold mb-4">
                                                {service.title}
                                            </h3>

                                            <p className="text-muted-foreground leading-relaxed mb-6">
                                                {service.description}
                                            </p>

                                            <Button variant="outline" className="w-full rounded-xl" asChild>
                                                <a
                                                    href={`https://wa.me/${settings?.whatsappNumber || "919876543210"}?text=${serviceWhatsapp}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Request Quote
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </a>
                                            </Button>
                                        </motion.div>
                                    </ScrollReveal>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="mb-4 text-6xl">🌷</div>
                            <h3 className="font-serif text-2xl font-bold mb-2">Services Coming Soon</h3>
                            <p className="text-muted-foreground mb-6">
                                We&apos;re preparing something special. Contact us directly for inquiries.
                            </p>
                            <Button asChild>
                                <Link href="/contact">Contact Us</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-6">
                    <ScrollReveal>
                        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 p-12 text-center border border-primary/10">
                            <h2 className="mb-4 font-serif text-3xl font-bold">Have Something Special in Mind?</h2>
                            <p className="mb-8 text-muted-foreground max-w-xl mx-auto">
                                Whether it&apos;s a unique occasion or a custom request, we&apos;d love to hear from you.
                                Let&apos;s create something beautiful together.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" className="bg-green-600 hover:bg-green-500" asChild>
                                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                        <MessageCircle className="mr-2 h-5 w-5" />
                                        WhatsApp Us
                                    </a>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <a href={`tel:${settings?.phoneNumber || "+919876543210"}`}>
                                        <Phone className="mr-2 h-4 w-4" />
                                        Call Now
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <Footer />
        </main>
    );
}
