import "~/styles/globals.css";

import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "~/app/_components/ThemeProvider";
import { ConvexClientProvider } from "~/app/_components/ConvexClientProvider";
import { AuthProvider } from "~/app/_components/AuthProvider";
import { Toaster } from "~/components/ui/sonner";
import { LenisProvider } from "~/components/ui/LenisProvider";
import { CurrencyProvider } from "~/app/_components/CurrencyProvider";
import * as React from "react";

// Lazy load non-critical components
const BotWidget = React.lazy(() => import("~/components/bot/BotWidget").then(m => ({ default: m.BotWidget })));
const Analytics = React.lazy(() => import("@vercel/analytics/react").then(m => ({ default: m.Analytics })));

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",  // Faster text rendering
    adjustFontFallback: true,  // Reduce layout shift
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-serif",
    display: "swap",  // Faster text rendering
    adjustFontFallback: true,  // Reduce layout shift
});

export const metadata = {
    title: "Grace Blooms | Artisanal Flower Boutique",
    description: "Exquisite floral arrangements and botanical wonders. Contact us via WhatsApp, phone, or email to order.",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
        viewportFit: "cover",
    },
    other: {
        'link': [
            { rel: 'preconnect', href: 'https://2lcifuj23a.ufs.sh' },
            { rel: 'preconnect', href: 'https://utfs.io' },
            { rel: 'dns-prefetch', href: 'https://shocking-dogfish-638.convex.cloud' },
        ]
    }
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`font-sans ${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
                <ConvexClientProvider>
                    <AuthProvider>
                        <CurrencyProvider>
                            <ThemeProvider
                                attribute="class"
                                defaultTheme="light"
                                enableSystem
                                disableTransitionOnChange={false}
                            >
                                <LenisProvider>
                                    {children}
                                    <React.Suspense fallback={null}>
                                        <BotWidget />
                                    </React.Suspense>
                                    <Toaster position="bottom-right" richColors />
                                </LenisProvider>
                            </ThemeProvider>
                        </CurrencyProvider>
                    </AuthProvider>
                </ConvexClientProvider>
                <React.Suspense fallback={null}>
                    <Analytics />
                </React.Suspense>
            </body>
        </html>
    );
}
