"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
    MessageCircle,
    X,
    Send,
    Loader2,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Lock,
} from "lucide-react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { useAuth } from "~/app/_components/AuthProvider";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

// Pages where bot should NOT appear
const excludedPaths = ["/sign-in", "/sign-up", "/admin"];

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: number;
    inquiryCreated?: boolean;
    referenceId?: string;
}

export function BotWidget() {
    const pathname = usePathname();
    const prefersReducedMotion = useReducedMotion();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();

    const [isOpen, setIsOpen] = React.useState(false);
    const [input, setInput] = React.useState("");
    const [isTyping, setIsTyping] = React.useState(false);
    const [localMessages, setLocalMessages] = React.useState<Message[]>([]);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    // Check if bot is enabled
    const aiSettings = useQuery(api.ai.getSettings, {});
    const chatHistory = useQuery(
        api.ai.getChatHistory,
        user?.id ? { userId: user.id, limit: 50 } : "skip"
    );

    // Actions
    const chat = useAction(api.gemini.chat);
    const getRagContext = useAction(api.gemini.getRagContext);
    const clearChatHistory = useMutation(api.ai.clearChatHistory);
    const clearUserMemory = useMutation(api.ai.clearUserMemory);

    // Check if we should hide the bot
    const shouldHideBot = excludedPaths.some((path) => pathname.startsWith(path));

    // Sync chat history to local messages
    React.useEffect(() => {
        if (chatHistory && chatHistory.length > 0) {
            const messages: Message[] = chatHistory.map((msg, idx) => ({
                id: msg._id || `msg-${idx}`,
                role: msg.role as "user" | "assistant",
                content: msg.content,
                timestamp: msg.createdAt,
            }));
            setLocalMessages(messages);
        }
    }, [chatHistory]);

    // Scroll to bottom on new messages
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [localMessages, isTyping]);

    const handleSend = async () => {
        if (!input.trim() || !user?.id || isTyping) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: "user",
            content: input.trim(),
            timestamp: Date.now(),
        };

        setLocalMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            // Get RAG context
            const context = await getRagContext({ userId: user.id });

            // Send to Gemini
            const response = await chat({
                userId: user.id,
                userMessage: userMessage.content,
                catalogContext: context.catalogContext,
                serviceContext: context.serviceContext,
                faqContext: context.faqContext,
            });

            const assistantMessage: Message = {
                id: `assistant-${Date.now()}`,
                role: "assistant",
                content: response.message,
                timestamp: Date.now(),
                inquiryCreated: response.inquiryCreated,
                referenceId: response.referenceId,
            };

            setLocalMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = {
                id: `error-${Date.now()}`,
                role: "assistant",
                content: "Sorry, I encountered an error. Please try again.",
                timestamp: Date.now(),
            };
            setLocalMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleClearData = async () => {
        if (!user?.id) return;

        try {
            await clearChatHistory({ userId: user.id });
            await clearUserMemory({ userId: user.id });
            setLocalMessages([]);
        } catch (error) {
            console.error("Failed to clear data:", error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Don't render if bot is disabled or on excluded paths
    if (shouldHideBot || aiSettings?.enabled === false) {
        return null;
    }

    // Locked state for unauthenticated users
    const isLocked = !isAuthenticated && !authLoading;

    return (
        <>
            {/* Chat Widget Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={prefersReducedMotion ? {} : { scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className={cn(
                            "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-colors",
                            "bg-gradient-to-br from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600"
                        )}
                        aria-label="Open chat"
                    >
                        {isLocked ? (
                            <Lock className="h-6 w-6" />
                        ) : (
                            <MessageCircle className="h-6 w-6" />
                        )}
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 flex h-[100dvh] sm:h-[600px] w-full sm:w-[400px] flex-col overflow-hidden bg-background sm:rounded-2xl border-t sm:border shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between bg-gradient-to-r from-pink-500 to-orange-500 px-4 py-3 text-white">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                                    <MessageCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Grace</h3>
                                    <p className="text-xs opacity-90">Floral Assistant</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {isAuthenticated && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-white hover:bg-white/20"
                                        onClick={handleClearData}
                                        title="Clear my bot data"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-white hover:bg-white/20"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Locked State */}
                        {isLocked ? (
                            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                    <Lock className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Sign in to Chat</h4>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Please sign in to chat with Grace and submit inquiries.
                                    </p>
                                </div>
                                <Button asChild>
                                    <Link href={`/sign-in?redirect=${encodeURIComponent(pathname)}`}>
                                        Sign In
                                    </Link>
                                </Button>
                            </div>
                        ) : authLoading ? (
                            <div className="flex flex-1 items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <>
                                {/* Messages */}
                                <ScrollArea className="flex-1 p-4">
                                    <div className="space-y-4">
                                        {/* Welcome message */}
                                        {localMessages.length === 0 && (
                                            <div className="flex gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-500 text-white">
                                                    <MessageCircle className="h-4 w-4" />
                                                </div>
                                                <div className="rounded-2xl rounded-tl-none bg-muted px-4 py-3">
                                                    <p className="text-sm">
                                                        Hello{user?.name ? `, ${user.name.split(" ")[0]}` : ""}! 🌸 I'm Grace, your floral assistant. Tell me about the occasion you're planning, and I'll help you find the perfect arrangement!
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Chat messages */}
                                        {localMessages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={cn(
                                                    "flex gap-3",
                                                    msg.role === "user" && "flex-row-reverse"
                                                )}
                                            >
                                                {msg.role === "assistant" && (
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-500 text-white">
                                                        <MessageCircle className="h-4 w-4" />
                                                    </div>
                                                )}
                                                <div
                                                    className={cn(
                                                        "max-w-[80%] rounded-2xl px-4 py-3",
                                                        msg.role === "user"
                                                            ? "rounded-tr-none bg-primary text-primary-foreground"
                                                            : "rounded-tl-none bg-muted"
                                                    )}
                                                >
                                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>

                                                    {/* Success indicator for inquiry */}
                                                    {msg.inquiryCreated && msg.referenceId && (
                                                        <div className="mt-2 flex items-center gap-2 rounded-lg bg-green-100 px-3 py-2 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                            <CheckCircle2 className="h-4 w-4" />
                                                            <span className="text-xs font-medium">
                                                                Ref: {msg.referenceId}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Typing indicator */}
                                        {isTyping && (
                                            <div className="flex gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-500 text-white">
                                                    <MessageCircle className="h-4 w-4" />
                                                </div>
                                                <div className="rounded-2xl rounded-tl-none bg-muted px-4 py-3">
                                                    <div className="flex gap-1">
                                                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
                                                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
                                                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div ref={scrollRef} />
                                    </div>
                                </ScrollArea>

                                {/* Input */}
                                <div className="border-t bg-background p-4">
                                    <div className="flex gap-2 items-end">
                                        <Textarea
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Type your message..."
                                            disabled={isTyping}
                                            className="min-h-[60px] resize-none rounded-xl"
                                        />
                                        <Button
                                            onClick={handleSend}
                                            disabled={!input.trim() || isTyping}
                                            size="icon"
                                            className="h-10 w-10 shrink-0 rounded-xl mb-1"
                                        >
                                            {isTyping ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Send className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
