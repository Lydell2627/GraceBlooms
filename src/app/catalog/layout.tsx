import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Flower Catalog | Grace Blooms - Luxury Floral Arrangements",
    description: "Browse our stunning collection of luxury floral arrangements. Wedding bouquets, anniversary flowers, birthday surprises & custom orders. Contact us via WhatsApp to order.",
    keywords: ["flowers", "floral arrangements", "wedding flowers", "anniversary bouquets", "Grace Blooms", "Mumbai florist", "luxury flowers"],
    openGraph: {
        title: "Flower Catalog | Grace Blooms",
        description: "Discover premium hand-crafted floral arrangements for every occasion",
        type: "website",
        siteName: "Grace Blooms",
        locale: "en_IN",
    },
    twitter: {
        card: "summary_large_image",
        title: "Flower Catalog | Grace Blooms",
        description: "Premium floral arrangements for weddings, anniversaries & more",
    },
    alternates: {
        canonical: "/catalog",
    },
};

// Force dynamic rendering for pages using useSearchParams
export const dynamic = "force-dynamic";

export default function CatalogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
