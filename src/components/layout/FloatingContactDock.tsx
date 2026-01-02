"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MessageCircle, Phone, Mail, X, ChevronUp } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { usePathname } from "next/navigation";

// Pages where the contact dock should NOT appear
const hiddenPaths = ["/sign-in", "/sign-up", "/admin"];

export function FloatingContactDock() {
    const prefersReducedMotion = useReducedMotion();
    const pathname = usePathname();
    const settings = useQuery(api.settings.get, {});

    const [isExpanded, setIsExpanded] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(true);

    // Hide on excluded paths
    const shouldShow = !hiddenPaths.some((path) => pathname.startsWith(path));

    // Handle scroll to show/hide
    React.useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            // Hide when scrolling down, show when scrolling up
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                setIsExpanded(false);
            }
            setIsVisible(currentScrollY < 200 || currentScrollY < lastScrollY);
            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!shouldShow) return null;

    // WhatsApp link
    const whatsappMessage = encodeURIComponent("Hi! I'd like to inquire about your floral arrangements.");
    const whatsappLink = `https://wa.me/${settings?.whatsappNumber || "919876543210"}?text=${whatsappMessage}`;

    const contactOptions = [
        {
            id: "whatsapp",
            icon: MessageCircle,
            label: "WhatsApp",
            href: whatsappLink,
            external: true,
            className: "bg-green-600 hover:bg-green-500 text-white",
        },
        {
            id: "phone",
            icon: Phone,
            label: "Call",
            href: `tel:${settings?.phoneNumber || "+919876543210"}`,
            external: false,
            className: "bg-primary hover:bg-primary/90 text-primary-foreground",
        },
        {
            id: "email",
            icon: Mail,
            label: "Email",
            href: "/contact",
            external: false,
            className: "bg-blush hover:bg-blush/90 text-white",
        },
    ];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
                >
                    {/* Expanded Options */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col gap-2"
                            >
                                {contactOptions.map((option, i) => {
                                    const Icon = option.icon;
                                    const isExternal = option.external;
                                    const Component = isExternal ? "a" : "a";

                                    return (
                                        <motion.div
                                            key={option.id}
                                            initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05, duration: 0.2 }}
                                        >
                                            <Component
                                                href={option.href}
                                                target={isExternal ? "_blank" : undefined}
                                                rel={isExternal ? "noopener noreferrer" : undefined}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-full pl-4 pr-2 py-2 shadow-lg transition-transform hover:scale-105",
                                                    option.className
                                                )}
                                            >
                                                <span className="text-sm font-medium">{option.label}</span>
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                            </Component>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Toggle Button */}
                    <motion.div
                        whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                        whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                    >
                        <Button
                            size="lg"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className={cn(
                                "h-14 w-14 rounded-full shadow-xl transition-colors",
                                isExpanded
                                    ? "bg-muted text-muted-foreground hover:bg-muted"
                                    : "bg-green-600 hover:bg-green-500 text-white"
                            )}
                        >
                            {isExpanded ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <MessageCircle className="h-6 w-6" />
                            )}
                        </Button>
                    </motion.div>

                    {/* Scroll to Top (when expanded) */}
                    <AnimatePresence>
                        {!isExpanded && window?.scrollY > 500 && (
                            <motion.div
                                initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-10 w-10 rounded-full shadow-lg"
                                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                >
                                    <ChevronUp className="h-5 w-5" />
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
