import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Services | Grace Blooms - Wedding, Event & Corporate Florals",
    description: "Explore our premium floral services. Wedding & event arrangements, corporate gifts, sympathy tributes, subscription services & floral consultations in Mumbai.",
    keywords: ["floral services", "wedding flowers", "event florals", "corporate flowers", "Grace Blooms", "Mumbai florist"],
    openGraph: {
        title: "Our Services | Grace Blooms",
        description: "Premium floral services for weddings, events, corporate gifts & more",
        type: "website",
        siteName: "Grace Blooms",
        locale: "en_IN",
    },
    twitter: {
        card: "summary_large_image",
        title: "Our Services | Grace Blooms",
        description: "Wedding, event & corporate floral services in Mumbai",
    },
    alternates: {
        canonical: "/services",
    },
};

export default function ServicesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
