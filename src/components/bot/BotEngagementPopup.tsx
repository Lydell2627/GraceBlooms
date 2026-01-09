"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MessageCircle, X, Sparkles } from "lucide-react";
import { Button } from "~/components/ui/button";

const POPUP_SESSION_KEY = "grace_bot_popup_shown";
const POPUP_DELAY = 5000; // 5 seconds

interface BotEngagementPopupProps {
    onOpenChat: () => void;
}

export function BotEngagementPopup({ onOpenChat }: BotEngagementPopupProps) {
    const [isVisible, setIsVisible] = React.useState(false);
    const [isDismissed, setIsDismissed] = React.useState(false);
    const prefersReducedMotion = useReducedMotion();

    React.useEffect(() => {
        // Check if already shown this session
        const hasShown = sessionStorage.getItem(POPUP_SESSION_KEY);
        if (hasShown) {
            setIsDismissed(true);
            return;
        }

        // Show popup after delay
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, POPUP_DELAY);

        return () => clearTimeout(timer);
    }, []);

    const handleChatClick = () => {
        setIsVisible(false);
        setIsDismissed(true);
        sessionStorage.setItem(POPUP_SESSION_KEY, "true");
        onOpenChat();
    };

    const handleDismiss = () => {
        setIsVisible(false);
        setIsDismissed(true);
        sessionStorage.setItem(POPUP_SESSION_KEY, "true");
    };

    if (isDismissed) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                        onClick={handleDismiss}
                    />

                    {/* Popup Modal */}
                    <motion.div
                        initial={
                            prefersReducedMotion
                                ? { opacity: 0 }
                                : { opacity: 0, scale: 0.9, y: 20 }
                        }
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={
                            prefersReducedMotion
                                ? { opacity: 0 }
                                : { opacity: 0, scale: 0.9, y: 20 }
                        }
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-md sm:bottom-6 sm:right-6"
                    >
                        <div className="relative overflow-hidden rounded-2xl bg-background shadow-2xl border">
                            {/* Close button */}
                            <button
                                onClick={handleDismiss}
                                className="absolute right-3 top-3 z-10 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                aria-label="Close"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            {/* Gradient header */}
                            <div className="relative bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 px-6 pb-8 pt-6">
                                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />

                                <div className="relative flex items-start gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                                        <MessageCircle className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1 text-white">
                                        <h3 className="text-lg font-semibold">
                                            Need help choosing the perfect flowers?
                                        </h3>
                                        <p className="mt-1 text-sm text-white/90">
                                            Grace, our AI floral consultant, is here to help!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Sparkles className="h-4 w-4 text-pink-500" />
                                        <span>Get personalized recommendations instantly</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Sparkles className="h-4 w-4 text-pink-500" />
                                        <span>Expert guidance for every occasion</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Sparkles className="h-4 w-4 text-pink-500" />
                                        <span>24/7 availability - chat anytime</span>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                                    <Button
                                        onClick={handleChatClick}
                                        className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                                    >
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        Chat with Grace
                                    </Button>
                                    <Button
                                        onClick={handleDismiss}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        Maybe Later
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
