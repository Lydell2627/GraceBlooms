"use client";

import { useSession } from "~/lib/auth-client";
import { useState, useEffect, useRef } from "react";
import { Send, Loader2, User } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

interface ChatWindowProps {
    otherUserId: string;
    otherUserName: string;
}

export function ChatWindow({ otherUserId, otherUserName }: ChatWindowProps) {
    const { data: session } = useSession();
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isSending, setIsSending] = useState(false);

    const userId = session?.user.id ?? "";

    // Real-time messages query (Convex automatically updates when data changes)
    const messages = useQuery(api.messages.list, {
        userId: userId,
        otherUserId: otherUserId,
    });

    // Send message mutation
    const sendMessage = useMutation(api.messages.send);

    const isLoading = messages === undefined;

    // Scroll to bottom effect
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !session?.user.id) return;

        setIsSending(true);
        try {
            await sendMessage({
                content: input,
                senderId: session.user.id,
                senderName: session.user.name ?? undefined,
                receiverId: otherUserId,
            });
            setInput("");
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden">
            {/* Header */}
            <div className="bg-muted/50 px-6 py-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold leading-none">{otherUserName}</h3>
                        <p className="text-xs text-muted-foreground mt-1">Floral Consultant</p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages?.map((msg) => {
                    const isMe = msg.senderId === session?.user.id;
                    return (
                        <div
                            key={msg._id}
                            className={cn(
                                "flex flex-col",
                                isMe ? "items-end" : "items-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
                                    isMe
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-muted text-foreground rounded-tl-none"
                                )}
                            >
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-1 px-1 uppercase tracking-wider">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-muted/30">
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="bg-background border-none shadow-inner"
                        disabled={isSending}
                    />
                    <Button
                        type="submit"
                        disabled={isSending || !input.trim()}
                        size="icon"
                        className="shrink-0"
                    >
                        {isSending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                        <span className="sr-only">Send message</span>
                    </Button>
                </form>
            </div>
        </div>
    );
}
