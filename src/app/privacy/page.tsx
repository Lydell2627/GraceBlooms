"use client";

import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Navbar } from "~/components/layout/Navbar";

export default function PrivacyPage() {
    const settings = useQuery(api.settings.get, {});
    const contactEmail = settings?.email || "hello@graceblooms.com";

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
                    <h1 className="font-serif text-4xl font-bold mb-8">Privacy Policy</h1>
                    <p className="text-muted-foreground mb-8">Last Updated: December 2024</p>

                    <h2>1. Introduction</h2>
                    <p>
                        At Grace Blooms, we respect your privacy and are committed to protecting the personal information you share with us. This policy explains how we collect, use, and safeguard your data.
                    </p>

                    <h2>2. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us when you create an account, make a purchase, or subscribe to our newsletter. This includes:
                    </p>
                    <ul>
                        <li>Name and contact information</li>
                        <li>Billing and shipping addresses</li>
                        <li>Payment information (processed securely by third-party providers)</li>
                        <li>Order history and preferences</li>
                    </ul>

                    <h2>3. How We Use Your Information</h2>
                    <p>
                        We use your information to:
                    </p>
                    <ul>
                        <li>Process and fulfill your orders</li>
                        <li>Communicate with you about your account and purchases</li>
                        <li>Send you marketing communications (if you have opted in)</li>
                        <li>Improve our website and customer service</li>
                    </ul>

                    <h2>4. Data Security</h2>
                    <p>
                        We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                    </p>

                    <h2>5. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
                    </p>
                </div>
            </section>
        </main>
    );
}
