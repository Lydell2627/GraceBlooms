"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Flower2, Heart, Award, Users, Sparkles, MessageCircle, Phone, Mail } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { Button } from "~/components/ui/button";
import { ScrollReveal } from "~/components/ui/scroll-reveal";

const values = [
    {
        icon: Heart,
        title: "Passion for Floristry",
        description: "Every arrangement is crafted with love and dedication to the art of flowers.",
    },
    {
        icon: Award,
        title: "Premium Quality",
        description: "We source only the freshest blooms from trusted local and international growers.",
    },
    {
        icon: Users,
        title: "Customer First",
        description: "Your satisfaction is our priority. We go above and beyond to exceed expectations.",
    },
    {
        icon: Sparkles,
        title: "Artisan Craftsmanship",
        description: "Our designers bring years of experience and creative vision to every piece.",
    },
];

const milestones = [
    { year: "2024", event: "Grace Blooms founded with a vision for luxury floristry" },
    { year: "2024", event: "Launched online catalog and inquiry system" },
    { year: "2025", event: "Expanded wedding and event services" },
    { year: "2025", event: "Introduced AI-powered floral consultation" },
];

export default function AboutPage() {
    const prefersReducedMotion = useReducedMotion();
    const settings = useQuery(api.settings.get, {});

    const whatsappMessage = encodeURIComponent("Hi! I'd like to learn more about Grace Blooms.");
    const whatsappLink = `https://wa.me/${settings?.whatsappNumber || "919876543210"}?text=${whatsappMessage}`;

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://2lcifuj23a.ufs.sh/f/7mwewDydS8QM5cnd4yUj4at0SrcIVxTMmfYzNpQnWXGdAHsF"
                        alt="About Grace Blooms"
                        fill
                        className="object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
                </div>

                <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <div className="flex justify-center mb-6">
                            <motion.div
                                whileHover={prefersReducedMotion ? {} : { rotate: 12, scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <Flower2 className="h-16 w-16 text-primary" />
                            </motion.div>
                        </div>

                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            About <span className="italic text-primary">Grace Blooms</span>
                        </h1>
                        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                            We believe flowers have the power to transform moments into memories.
                            Our boutique brings together artistry, passion, and the finest blooms
                            to create arrangements that speak to the heart.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-2 items-center">
                        <ScrollReveal>
                            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                                <Image
                                    src="https://2lcifuj23a.ufs.sh/f/7mwewDydS8QMgz19w4ualML4DajYpfn8mBi1RTGIFctgOHro"
                                    alt="Our workshop"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={0.2}>
                            <div>
                                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                                    Our Story
                                </h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        Grace Blooms was born from a simple belief: that every occasion deserves
                                        to be adorned with nature&apos;s most beautiful creations. What started as a
                                        passion project has blossomed into a full-service floral boutique.
                                    </p>
                                    <p>
                                        Our team of skilled florists combines traditional techniques with modern
                                        design sensibilities to create arrangements that are both timeless and
                                        contemporary. We work closely with each client to understand their vision
                                        and bring it to life.
                                    </p>
                                    <p>
                                        From intimate bouquets to grand wedding installations, we approach every
                                        project with the same dedication to quality, creativity, and customer
                                        satisfaction.
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                                What We Stand For
                            </h2>
                            <p className="text-muted-foreground">
                                Our values guide everything we do, from sourcing the finest blooms
                                to delivering unforgettable experiences.
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {values.map((value, i) => {
                            const Icon = value.icon;
                            return (
                                <ScrollReveal key={i} delay={i * 0.1}>
                                    <motion.div
                                        whileHover={prefersReducedMotion ? {} : { y: -8 }}
                                        className="text-center p-6 rounded-3xl bg-card border transition-all hover:shadow-bloom"
                                    >
                                        <div className="mb-4 flex justify-center">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                                <Icon className="h-6 w-6" />
                                            </div>
                                        </div>
                                        <h3 className="font-serif text-xl font-bold mb-2">{value.title}</h3>
                                        <p className="text-sm text-muted-foreground">{value.description}</p>
                                    </motion.div>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Journey / Timeline */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                                Our Journey
                            </h2>
                            <p className="text-muted-foreground">
                                From humble beginnings to becoming a trusted name in luxury floristry.
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="max-w-2xl mx-auto">
                        {milestones.map((milestone, i) => (
                            <ScrollReveal key={i} delay={i * 0.1}>
                                <div className="flex gap-6 mb-8 last:mb-0">
                                    <div className="flex flex-col items-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#A3B18A] text-white font-bold text-sm shrink-0">
                                            {milestone.year}
                                        </div>
                                        {i < milestones.length - 1 && (
                                            <div className="w-0.5 h-full mt-2 bg-border" />
                                        )}
                                    </div>
                                    <div className="pb-8">
                                        <p className="text-lg font-medium">{milestone.event}</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-foreground text-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center max-w-3xl mx-auto">
                            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                                Let&apos;s Create Something Beautiful
                            </h2>
                            <p className="text-background/70 mb-8">
                                Ready to experience the Grace Blooms difference? Get in touch today.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Button size="lg" className="bg-green-600 hover:bg-green-500" asChild>
                                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                        <MessageCircle className="mr-2 h-5 w-5" />
                                        WhatsApp Us
                                    </a>
                                </Button>
                                <Button size="lg" variant="outline" className="text-background border-background/30 hover:bg-background/10" asChild>
                                    <a href={`tel:${settings?.phoneNumber || "+919876543210"}`}>
                                        <Phone className="mr-2 h-4 w-4" />
                                        Call Now
                                    </a>
                                </Button>
                                <Button size="lg" variant="outline" className="text-background border-background/30 hover:bg-background/10" asChild>
                                    <Link href="/contact">
                                        <Mail className="mr-2 h-4 w-4" />
                                        Email Us
                                    </Link>
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
