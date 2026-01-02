import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | Grace Blooms - Artisanal Floral Boutique in Mumbai",
    description: "Learn about Grace Blooms, Mumbai's premier artisanal flower boutique. Our story, our passion for floristry, and our commitment to creating unforgettable moments.",
    keywords: ["about Grace Blooms", "florist Mumbai", "artisanal flowers", "luxury floristry", "flower boutique"],
    openGraph: {
        title: "About Us | Grace Blooms",
        description: "Mumbai's premier artisanal flower boutique - crafting beauty since day one",
        type: "website",
        siteName: "Grace Blooms",
        locale: "en_IN",
    },
    twitter: {
        card: "summary_large_image",
        title: "About Us | Grace Blooms",
        description: "Mumbai's premier artisanal flower boutique",
    },
    alternates: {
        canonical: "/about",
    },
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
