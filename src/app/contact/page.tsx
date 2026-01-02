"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Phone, Mail, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { toast } from "sonner";

export default function ContactPage() {
    const prefersReducedMotion = useReducedMotion();
    const settings = useQuery(api.settings.get, {});
    const createInquiry = useMutation(api.contact.create);

    const [formState, setFormState] = React.useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);

    const whatsappMessage = encodeURIComponent("Hi! I'd like to inquire about your floral services.");
    const whatsappLink = `https://wa.me/${settings?.whatsappNumber || "919876543210"}?text=${whatsappMessage}`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
            toast.error("Please fill in all required fields");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formState.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);

        try {
            await createInquiry({
                name: formState.name.trim(),
                email: formState.email.trim(),
                phone: formState.phone.trim() || undefined,
                message: formState.message.trim(),
                source: "contact_form",
            });

            setSubmitted(true);
            toast.success("Message sent successfully!", {
                description: "We'll get back to you within 24 hours.",
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Failed to send message. Please try again or contact us directly.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactMethods = [
        {
            icon: MessageCircle,
            title: "WhatsApp",
            description: "Chat with us instantly",
            value: settings?.whatsappNumber || "+91 98765 43210",
            href: whatsappLink,
            color: "bg-green-600 hover:bg-green-500",
            external: true,
        },
        {
            icon: Phone,
            title: "Phone",
            description: "Give us a call",
            value: settings?.phoneNumber || "+91 98765 43210",
            href: `tel:${settings?.phoneNumber || "+919876543210"}`,
            color: "bg-primary hover:bg-primary/90",
            external: false,
        },
        {
            icon: Mail,
            title: "Email",
            description: "Send us an email",
            value: settings?.email || "hello@graceblooms.com",
            href: `mailto:${settings?.email || "hello@graceblooms.com"}`,
            color: "bg-blush hover:bg-blush/90",
            external: false,
        },
    ];

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-32 pb-16 bg-gradient-to-b from-muted/50 to-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Get in <span className="italic text-primary">Touch</span>
                        </h1>
                        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                            Have a question or ready to order? We&apos;d love to hear from you.
                            Reach out through any of the channels below.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 md:grid-cols-3">
                        {contactMethods.map((method, i) => {
                            const Icon = method.icon;
                            return (
                                <ScrollReveal key={i} delay={i * 0.1}>
                                    <motion.a
                                        href={method.href}
                                        target={method.external ? "_blank" : undefined}
                                        rel={method.external ? "noopener noreferrer" : undefined}
                                        whileHover={prefersReducedMotion ? {} : { y: -4 }}
                                        className="block rounded-3xl border bg-card p-6 transition-all hover:shadow-bloom"
                                    >
                                        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full text-white ${method.color}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="font-serif text-xl font-bold mb-1">{method.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                                        <p className="font-medium text-primary">{method.value}</p>
                                    </motion.a>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-2">
                        {/* Form */}
                        <ScrollReveal>
                            <div className="rounded-3xl border bg-card p-8">
                                <h2 className="font-serif text-2xl font-bold mb-6">Send Us a Message</h2>

                                {submitted ? (
                                    <motion.div
                                        initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <div className="mb-4 text-6xl">💐</div>
                                        <h3 className="font-serif text-2xl font-bold mb-2">Thank You!</h3>
                                        <p className="text-muted-foreground mb-6">
                                            We&apos;ve received your message and will get back to you within 24 hours.
                                        </p>
                                        <Button onClick={() => setSubmitted(false)}>
                                            Send Another Message
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Name *</Label>
                                                <Input
                                                    id="name"
                                                    placeholder="Your name"
                                                    value={formState.name}
                                                    onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                                                    className="rounded-xl"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email *</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    value={formState.email}
                                                    onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                                                    className="rounded-xl"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone (optional)</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="+91 98765 43210"
                                                value={formState.phone}
                                                onChange={(e) => setFormState((s) => ({ ...s, phone: e.target.value }))}
                                                className="rounded-xl"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message *</Label>
                                            <Textarea
                                                id="message"
                                                placeholder="Tell us about your occasion, preferred flowers, budget, or any questions..."
                                                value={formState.message}
                                                onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                                                className="rounded-xl min-h-[150px]"
                                                required
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full rounded-xl"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="mr-2 h-4 w-4" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </ScrollReveal>

                        {/* Info */}
                        <ScrollReveal delay={0.2}>
                            <div className="space-y-8">
                                <div>
                                    <h2 className="font-serif text-2xl font-bold mb-6">Visit Us</h2>
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <MapPin className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Location</p>
                                                <p className="text-muted-foreground">
                                                    {settings?.location || "123 Blossom Street, Garden District, City - 400001"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <Clock className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Business Hours</p>
                                                <p className="text-muted-foreground">
                                                    {settings?.businessHours || "Mon-Sat: 9AM - 8PM, Sun: 10AM - 6PM"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 p-8 border border-primary/10">
                                    <h3 className="font-serif text-xl font-bold mb-4">Need Immediate Assistance?</h3>
                                    <p className="text-muted-foreground mb-6">
                                        For urgent orders or quick inquiries, WhatsApp is the fastest way to reach us.
                                    </p>
                                    <Button size="lg" className="w-full bg-green-600 hover:bg-green-500 rounded-xl" asChild>
                                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                            <MessageCircle className="mr-2 h-5 w-5" />
                                            WhatsApp Us Now
                                        </a>
                                    </Button>
                                </div>

                                {/* FAQ Link */}
                                <div className="text-center">
                                    <p className="text-muted-foreground">
                                        Have questions? Check our frequently asked questions or ask our AI assistant.
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
