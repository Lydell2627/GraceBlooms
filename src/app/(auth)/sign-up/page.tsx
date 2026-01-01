"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Flower2, Mail, Lock, User, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { signUp } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { useAuth } from "~/app/_components/AuthProvider";

// Extend window for Google Identity Services
interface GoogleCredentialResponse {
    credential: string;
}

interface GooglePromptNotification {
    isNotDisplayed: () => boolean;
    isSkippedMoment: () => boolean;
}

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: {
                        client_id: string | undefined;
                        callback: (response: GoogleCredentialResponse) => void;
                        auto_select: boolean;
                        cancel_on_tap_outside: boolean;
                        ux_mode: "popup" | "redirect";
                    }) => void;
                    prompt: (callback?: (notification: GooglePromptNotification) => void) => void;
                    disableAutoSelect: () => void;
                };
            };
        };
        handleGoogleCredential?: (response: GoogleCredentialResponse) => void;
    }
}

export default function SignUpPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [gisLoaded, setGisLoaded] = React.useState(false);
    const [googleLoading, setGoogleLoading] = React.useState(false);

    // Redirect if already authenticated
    React.useEffect(() => {
        if (isAuthenticated && user && !authLoading) {
            router.push("/");
        }
    }, [isAuthenticated, user, authLoading, router]);

    const passwordRequirements = [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "Contains a number", met: /\d/.test(password) },
        { label: "Contains uppercase", met: /[A-Z]/.test(password) },
    ];

    const allRequirementsMet = passwordRequirements.every((r) => r.met);
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

    const handleGoogleCredentialResponse = React.useCallback(async (response: GoogleCredentialResponse) => {
        setGoogleLoading(true);
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential: response.credential }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Failed to sign up with Google");
                setGoogleLoading(false);
                setIsLoading(false);
                return;
            }

            toast.success(data.isNew ? "Account created! Welcome!" : "Welcome back!");
            router.push("/");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong with Google sign up.");
            setGoogleLoading(false);
            setIsLoading(false);
        }
    }, [router]);

    React.useEffect(() => {
        if (gisLoaded && window.google) {
            window.handleGoogleCredential = handleGoogleCredentialResponse;

            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                callback: handleGoogleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: true,
                ux_mode: "popup",
            });
        }
    }, [gisLoaded, handleGoogleCredentialResponse]);

    const handleGoogleClick = () => {
        if (window.google) {
            setGoogleLoading(true);
            window.google.accounts.id.prompt((notification: GooglePromptNotification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    toast.error("Google popup was blocked. Please allow popups for this site.");
                    setGoogleLoading(false);
                }
            });
        } else {
            toast.error("Google services not loaded. Please refresh the page.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!allRequirementsMet) {
            toast.error("Please meet all password requirements");
            return;
        }

        if (!passwordsMatch) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const result = await signUp.email({
                email,
                password,
                name,
            });

            if (result.error) {
                toast.error(result.error.message || "Failed to create account");
            } else {
                toast.success("Account created successfully!");
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Already logged in - redirect in progress
    if (isAuthenticated && user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">You&apos;re already signed in. Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background px-4 py-8">
            {/* Google Identity Services Script */}
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
                onLoad={() => setGisLoaded(true)}
            />

            {/* Background decoration with floating elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl float" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-sage/5 blur-3xl float-delayed" />
                <div className="absolute top-1/4 left-10 h-40 w-40 rounded-full bg-primary/3 blur-2xl float-delayed" />
                <div className="absolute bottom-1/4 right-10 h-32 w-32 rounded-full bg-sage/3 blur-2xl float" />

                {/* Decorative flowers */}
                <div className="absolute top-20 right-20 opacity-10 float">
                    <Flower2 className="h-20 w-20 text-primary" />
                </div>
                <div className="absolute bottom-20 left-20 opacity-10 float-delayed">
                    <Flower2 className="h-16 w-16 text-secondary" />
                </div>
            </div>

            <Card className="w-full max-w-md border-none shadow-premium">
                <CardHeader className="text-center space-y-4">
                    <Link href="/" className="inline-flex items-center justify-center gap-2 mx-auto">
                        <Flower2 className="h-8 w-8 text-primary" />
                        <span className="font-serif text-2xl font-bold">
                            Grace <span className="text-primary italic">Blooms</span>
                        </span>
                    </Link>
                    <div>
                        <CardTitle className="text-2xl font-serif">Create Account</CardTitle>
                        <CardDescription>Join us for exclusive floral experiences</CardDescription>
                    </div>
                </CardHeader>

                <div className="px-6 pt-6 grid gap-4">
                    {/* Custom styled Google Sign-Up Button */}
                    <Button
                        variant="outline"
                        type="button"
                        disabled={isLoading || googleLoading || !gisLoaded}
                        onClick={handleGoogleClick}
                        className="w-full h-11 font-medium"
                    >
                        {googleLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                        )}
                        {googleLoading ? "Signing up..." : "Sign up with Google"}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-10"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {password.length > 0 && (
                                <div className="space-y-1 mt-2">
                                    {passwordRequirements.map((req, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "flex items-center gap-2 text-xs",
                                                req.met ? "text-sage" : "text-muted-foreground"
                                            )}
                                        >
                                            <CheckCircle2 className={cn("h-3 w-3", !req.met && "opacity-30")} />
                                            {req.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={cn(
                                        "pl-10",
                                        confirmPassword.length > 0 && (passwordsMatch ? "border-sage" : "border-blush")
                                    )}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading || !allRequirementsMet || !passwordsMatch}
                        >
                            {isLoading && !googleLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>

                        <p className="text-sm text-center text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/sign-in" className="text-primary font-medium hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
