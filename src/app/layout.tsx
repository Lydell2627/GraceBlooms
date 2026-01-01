import "~/styles/globals.css";

import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "~/app/_components/ThemeProvider";
import { ConvexClientProvider } from "~/app/_components/ConvexClientProvider";
import { AuthProvider } from "~/app/_components/AuthProvider";
import { Toaster } from "~/components/ui/sonner";

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
    description: "Exquisite floral arrangements and botanical wonders. Grace Blooms - Emotions in Full Bloom.",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
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
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange={false}
                        >
                            {children}
                            <Toaster position="bottom-right" richColors />
                        </ThemeProvider>
                    </AuthProvider>
                </ConvexClientProvider>
            </body>
        </html>
    );
}
