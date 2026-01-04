import "~/styles/globals.css";

import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "~/app/_components/ThemeProvider";
import { ConvexClientProvider } from "~/app/_components/ConvexClientProvider";
import { AuthProvider } from "~/app/_components/AuthProvider";
import { Toaster } from "~/components/ui/sonner";
import { BotWidget } from "~/components/bot/BotWidget";
import { LenisProvider } from "~/components/ui/LenisProvider";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-serif",
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
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="light"
                            enableSystem
                            disableTransitionOnChange={false}
                        >
                            <LenisProvider>
                                {children}
                                <BotWidget />
                                <Toaster position="bottom-right" richColors />
                            </LenisProvider>
                        </ThemeProvider>
                    </AuthProvider>
                </ConvexClientProvider>
            </body>
        </html>
    );
}
