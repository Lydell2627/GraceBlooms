import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Inquiries | Grace Blooms - Track Your Orders",
    description: "View and track your flower arrangement inquiries. Check the status of your orders and stay updated on your Grace Blooms requests.",
    robots: {
        index: false, // Don't index user-specific pages
        follow: false,
    },
};

export default function MyInquiriesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
