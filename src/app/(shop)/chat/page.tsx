"use client";

import Link from "next/link";
import { ShieldCheck, MessageSquare, ArrowLeft, Info } from "lucide-react";
import { ChatWindow } from "~/components/chat/ChatWindow";
import { Navbar } from "~/components/layout/Navbar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { useAuth } from "~/app/_components/AuthProvider";

export default function ChatPage() {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background">
                <Navbar />
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
                <Navbar />
                <div className="mb-6 rounded-full bg-muted p-6">
                    <ShieldCheck className="h-12 w-12 text-muted-foreground" />
                </div>
                <h1 className="mb-2 text-2xl font-bold">Please Log In</h1>
                <p className="mb-8 text-muted-foreground">You must be signed in to chat with our floral concierges.</p>
                <Button asChild>
                    <Link href="/api/auth/signin">Sign In</Link>
                </Button>
            </div>
        );
    }

    // For demo purposes, check if user email contains 'admin'
    const isAdmin = user.email?.includes("admin") ?? false;
    const targetId = isAdmin ? "customer-user-id" : "admin-user-id";
    const targetName = isAdmin ? "Customer" : "Floral Concierge";

    return (
        <div className="min-h-screen bg-muted/30">
            <Navbar />

            <main className="container mx-auto max-w-6xl px-4 pb-12 pt-24 lg:pt-32">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-primary font-medium mb-1">
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                            Live Concierge
                        </div>
                        <h1 className="font-serif text-3xl font-bold md:text-4xl">Support & Consultations</h1>
                    </div>
                    <Button variant="outline" asChild className="hidden md:flex">
                        <Link href="/products">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Shop
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-8 lg:grid-cols-12">
                    {/* Status Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="border-none shadow-premium bg-background overflow-hidden">
                            <CardHeader className="bg-primary/5 border-b border-primary/10">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Info className="h-4 w-4 text-primary" />
                                    Concierge Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Availability</p>
                                    <div className="flex items-center gap-2 text-sage">
                                        <span className="h-2 w-2 bg-sage rounded-full"></span>
                                        <span className="text-sm">Agents Online (Wait time: &lt; 2 min)</span>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Expertise</p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary" className="bg-primary/5 border-primary/10 text-primary">Care Tips</Badge>
                                        <Badge variant="secondary" className="bg-primary/5 border-primary/10 text-primary">Custom Orders</Badge>
                                        <Badge variant="secondary" className="bg-primary/5 border-primary/10 text-primary">Delivery Status</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="rounded-xl border bg-card/50 p-6 backdrop-blur">
                            <h3 className="font-bold mb-3 flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Demo Note
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                To test the real-time functionality, open this page in two different browser windows.
                                Log in as <span className="text-foreground font-medium">Admin</span> in one and
                                <span className="text-foreground font-medium">Customer</span> in the other.
                            </p>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="lg:col-span-8">
                        <Card className="border-none shadow-premium bg-background h-[600px] flex flex-col">
                            <ChatWindow otherUserId={targetId} otherUserName={targetName} />
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}

import { Separator } from "~/components/ui/separator";
