"use client";

import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import Link from "next/link";

export default function TermsPage() {
    const settings = useQuery(api.settings.get, {});
    const contactEmail = settings?.email || "hello@graceblooms.com";

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
                    <h1 className="font-serif text-4xl font-bold mb-8">Terms of Service</h1>
                    <p className="text-muted-foreground mb-8">Last Updated: January 2026</p>

                    <h2>1. Agreement to Terms</h2>
                    <p>
                        By accessing and using Grace Blooms' website and services, you agree to be bound by these Terms of Service.
                        If you do not agree to these terms, please do not use our services.
                    </p>

                    <h2>2. Services Description</h2>
                    <p>
                        Grace Blooms provides floral arrangements, bouquets, and event floristry services. We offer:
                    </p>
                    <ul>
                        <li>Custom flower arrangements for various occasions</li>
                        <li>Wedding and event floral design</li>
                        <li>Same-day and scheduled delivery services</li>
                        <li>Online catalog browsing and inquiry system</li>
                    </ul>

                    <h2>3. Orders and Payments</h2>
                    <p>
                        All orders are subject to availability and confirmation. We reserve the right to refuse or cancel any order
                        for any reason, including but not limited to product availability, errors in pricing, or suspected fraud.
                    </p>
                    <p>
                        Payment must be made in full before delivery. We accept payments via the methods specified during checkout.
                    </p>

                    <h2>4. Product Substitutions</h2>
                    <p>
                        Due to the seasonal nature of flowers and market availability, we reserve the right to substitute flowers
                        or containers of equal or greater value while maintaining the overall design, color scheme, and style of the
                        arrangement.
                    </p>

                    <h2>5. Delivery</h2>
                    <p>
                        We make every effort to deliver on the requested date and time. However, delivery times are estimates and
                        not guaranteed. See our <Link href="/shipping" className="text-primary hover:underline">Shipping Policy</Link> for
                        detailed information.
                    </p>

                    <h2>6. Refusal of Delivery</h2>
                    <p>
                        If delivery is refused or a recipient is unavailable, additional delivery charges may apply for redelivery.
                        Perishable items may need to be discarded at our discretion.
                    </p>

                    <h2>7. Limitation of Liability</h2>
                    <p>
                        While we take great care in handling and delivering our products, we cannot be held responsible for:
                    </p>
                    <ul>
                        <li>Natural variations in flower bloom, size, or color</li>
                        <li>Shortened vase life due to environmental conditions beyond our control</li>
                        <li>Damage caused after successful delivery</li>
                        <li>Delays caused by circumstances beyond our control (weather, traffic, etc.)</li>
                    </ul>

                    <h2>8. Intellectual Property</h2>
                    <p>
                        All content on this website, including text, images, designs, and logos, is the property of Grace Blooms
                        and protected by copyright laws. Unauthorized use is prohibited.
                    </p>

                    <h2>9. Privacy</h2>
                    <p>
                        Your use of our services is also governed by our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                        Please review it to understand our data practices.
                    </p>

                    <h2>10. Modifications to Terms</h2>
                    <p>
                        We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting
                        on the website. Continued use of our services constitutes acceptance of modified terms.
                    </p>

                    <h2>11. Governing Law</h2>
                    <p>
                        These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction
                        of the courts in our operating location.
                    </p>

                    <h2>12. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms of Service, please contact us at{" "}
                        <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a>.
                    </p>
                </div>
            </section>
            <Footer />
        </main>
    );
}
