import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us | Grace Blooms - Order Flowers in Mumbai",
    description: "Get in touch with Grace Blooms to order stunning floral arrangements. Contact us via WhatsApp, phone, or email. Located in Mumbai, delivering across the city.",
    keywords: ["contact Grace Blooms", "order flowers Mumbai", "flower delivery", "WhatsApp flowers", "Mumbai florist contact"],
    openGraph: {
        title: "Contact Us | Grace Blooms",
        description: "Order beautiful floral arrangements via WhatsApp, phone or email",
        type: "website",
        siteName: "Grace Blooms",
        locale: "en_IN",
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact Us | Grace Blooms",
        description: "Order flowers in Mumbai - WhatsApp, phone or email",
    },
    alternates: {
        canonical: "/contact",
    },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
