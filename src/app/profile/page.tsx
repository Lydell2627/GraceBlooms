"use client";

import * as React from "react";
import Image from "next/image";
import { User, Mail, Calendar, Shield, ShieldCheck, Settings, LogOut } from "lucide-react";
import { useAuth } from "~/app/_components/AuthProvider";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { authClient } from "~/lib/auth-client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/");
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <Skeleton className="h-32 w-full rounded-2xl" />
                        <Skeleton className="h-48 w-full rounded-2xl" />
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    if (!isAuthenticated || !user) {
        router.push("/sign-in?redirect=/profile");
        return null;
    }

    const joinedDate = (user as { createdAt?: number }).createdAt
        ? new Date((user as { createdAt?: number }).createdAt!).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        })
        : "Unknown";

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16">
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* Profile Header Card */}
                    <Card className="border-none shadow-lg overflow-hidden">
                        <div className="h-24 sm:h-32 bg-gradient-to-r from-primary/20 via-blush/20 to-sage/20" />
                        <CardContent className="relative pt-0 pb-6">
                            <div className="flex flex-col sm:flex-row items-center gap-4 -mt-12 sm:-mt-16">
                                {user.image ? (
                                    <Image
                                        src={user.image}
                                        alt={user.name || "User"}
                                        width={96}
                                        height={96}
                                        className="h-20 w-20 sm:h-24 sm:w-24 rounded-full ring-4 ring-background shadow-lg"
                                    />
                                ) : (
                                    <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-background shadow-lg">
                                        <User className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                                    </div>
                                )}
                                <div className="text-center sm:text-left mt-2 sm:mt-8">
                                    <h1 className="text-xl sm:text-2xl font-bold font-serif">
                                        {user.name || "User"}
                                    </h1>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                                        <Badge
                                            variant={user.role === "ADMIN" ? "default" : "secondary"}
                                            className="gap-1"
                                        >
                                            {user.role === "ADMIN" ? (
                                                <ShieldCheck className="h-3 w-3" />
                                            ) : (
                                                <Shield className="h-3 w-3" />
                                            )}
                                            {user.role || "Customer"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Details */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-serif">Account Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="font-medium text-sm truncate">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/10">
                                    <Calendar className="h-5 w-5 text-sage" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Member Since</p>
                                    <p className="font-medium text-sm">{joinedDate}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blush/10">
                                    {user.role === "ADMIN" ? (
                                        <ShieldCheck className="h-5 w-5 text-blush" />
                                    ) : (
                                        <Shield className="h-5 w-5 text-blush" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Account Type</p>
                                    <p className="font-medium text-sm">{user.role === "ADMIN" ? "Administrator" : "Customer"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-serif">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {user.role === "ADMIN" && (
                                <Button
                                    variant="outline"
                                    className="w-full justify-start rounded-xl"
                                    onClick={() => router.push("/admin")}
                                >
                                    <Settings className="mr-2 h-4 w-4" />
                                    Admin Dashboard
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                className="w-full justify-start rounded-xl"
                                onClick={() => router.push("/my-inquiries")}
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                My Inquiries
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start rounded-xl text-destructive hover:text-destructive"
                                onClick={handleSignOut}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Footer />
        </main>
    );
}
