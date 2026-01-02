import { Metadata } from "next";
import { CatalogItemPage } from "./CatalogItemPage";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    // Format slug for display
    const title = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    const description = `Discover our ${title} arrangement at Grace Blooms. Premium hand-crafted floral designs for weddings, anniversaries, birthdays & more. Contact us via WhatsApp, phone, or email to order.`;

    return {
        title: `${title} | Grace Blooms Floral Boutique`,
        description,
        keywords: [title, "flowers", "floral arrangement", "Grace Blooms", "luxury flowers", "Mumbai florist"],
        openGraph: {
            title: `${title} | Grace Blooms`,
            description,
            type: "website",
            siteName: "Grace Blooms",
            locale: "en_IN",
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | Grace Blooms`,
            description,
        },
        alternates: {
            canonical: `/catalog/${slug}`,
        },
    };
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    return <CatalogItemPage slug={slug} />;
}
