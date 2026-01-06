"use client";

import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { Shield, RefreshCw, Clock, Phone } from "lucide-react";

export default function RefundPage() {
    const settings = useQuery(api.settings.get, {});
    const contactEmail = settings?.email || "hello@graceblooms.com";
    const contactPhone = settings?.phoneNumber || "+91 98765 43210";

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
                    <h1 className="font-serif text-4xl font-bold mb-8">Refund & Return Policy</h1>
                    <p className="text-muted-foreground mb-8">Last Updated: January 2026</p>

                    <div className="not-prose grid gap-6 md:grid-cols-3 mb-12">
                        <div className="rounded-2xl border bg-card p-6 text-center">
                            <div className="flex justify-center mb-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <Shield className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                            <h3 className="font-serif text-lg font-bold mb-2">Freshness Guarantee</h3>
                            <p className="text-muted-foreground text-sm">
                                7-day freshness guarantee on all arrangements
                            </p>
                        </div>
                        <div className="rounded-2xl border bg-card p-6 text-center">
                            <div className="flex justify-center mb-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <RefreshCw className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                            <h3 className="font-serif text-lg font-bold mb-2">Free Replacement</h3>
                            <p className="text-muted-foreground text-sm">
                                Complimentary replacement for quality issues
                            </p>
                        </div>
                        <div className="rounded-2xl border bg-card p-6 text-center">
                            <div className="flex justify-center mb-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <Clock className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                            <h3 className="font-serif text-lg font-bold mb-2">24-Hour Claims</h3>
                            <p className="text-muted-foreground text-sm">
                                Report issues within 24 hours of delivery
                            </p>
                        </div>
                    </div>

                    <h2>1. Our Commitment to Quality</h2>
                    <p>
                        At Grace Blooms, we take pride in delivering the freshest, most beautiful flowers. We stand behind
                        the quality of every arrangement we create and deliver.
                    </p>

                    <h2>2. Freshness Guarantee</h2>
                    <p>
                        All our flower arrangements come with a 7-day freshness guarantee from the date of delivery, provided
                        the care instructions are followed. This guarantee covers:
                    </p>
                    <ul>
                        <li>Fresh, quality blooms at time of delivery</li>
                        <li>Proper hydration and conditioning</li>
                        <li>Arrangement integrity and design quality</li>
                    </ul>

                    <h2>3. Free Replacement Policy</h2>
                    <p>
                        If you're not completely satisfied with your flowers due to quality issues, we'll replace them free of
                        charge. Replacement is available for:
                    </p>
                    <ul>
                        <li>Flowers that arrive wilted or damaged</li>
                        <li>Arrangements that don't match the ordered description</li>
                        <li>Significant deviations from the expected design</li>
                        <li>Delivery errors (wrong recipient/location)</li>
                    </ul>

                    <h2>4. Refund Eligibility</h2>
                    <p>
                        Full refunds are provided in the following circumstances:
                    </p>
                    <ul>
                        <li><strong>Non-Delivery:</strong> If we fail to deliver your order on the specified date</li>
                        <li><strong>Cancelled Before Preparation:</strong> Orders cancelled before arrangement preparation begins</li>
                        <li><strong>Severe Quality Issues:</strong> When replacement is not feasible or acceptable</li>
                        <li><strong>Duplicate Charges:</strong> Accidental duplicate billing</li>
                    </ul>

                    <h2>5. Non-Refundable Situations</h2>
                    <p>
                        Due to the perishable nature of flowers, we cannot offer refunds or replacements for:
                    </p>
                    <ul>
                        <li>Natural variations in flower size, color, or bloom state</li>
                        <li>Shortened vase life due to environmental factors (extreme heat, cold, etc.)</li>
                        <li>Delivery refused by recipient</li>
                        <li>Incorrect address provided by customer</li>
                        <li>Recipient unavailable and safe delivery location not possible</li>
                        <li>Changes of mind after order preparation has begun</li>
                    </ul>

                    <h2>6. Cancellation Policy</h2>
                    <p><strong>Full Refund:</strong></p>
                    <ul>
                        <li>Orders cancelled at least 24 hours before scheduled delivery</li>
                        <li>Shop cancellations due to product unavailability</li>
                    </ul>

                    <p><strong>No Refund:</strong></p>
                    <ul>
                        <li>Cancellations made less than 24 hours before delivery</li>
                        <li>Cancellations after arrangement preparation has started</li>
                    </ul>

                    <h2>7. How to Request a Refund or Replacement</h2>
                    <p>
                        If you experience any issues with your order:
                    </p>
                    <ol>
                        <li><strong>Contact Us Immediately:</strong> Within 24 hours of delivery</li>
                        <li><strong>Provide Details:</strong> Order number, photos of the issue, and description</li>
                        <li><strong>Allow Inspection:</strong> We may need to review the arrangement</li>
                        <li><strong>Resolution:</strong> We'll arrange replacement or refund as appropriate</li>
                    </ol>

                    <div className="not-prose my-8 rounded-2xl border bg-muted/30 p-6">
                        <h3 className="font-serif text-xl font-bold mb-4">Contact for Refund/Replacement</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-medium">Phone</p>
                                    <a href={`tel:${contactPhone}`} className="text-primary hover:underline">
                                        {contactPhone}
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-medium">Email</p>
                                    <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">
                                        {contactEmail}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2>8. Refund Processing Time</h2>
                    <p>
                        Once approved, refunds are processed as follows:
                    </p>
                    <ul>
                        <li><strong>Credit/Debit Card:</strong> 5-7 business days</li>
                        <li><strong>UPI/Net Banking:</strong> 3-5 business days</li>
                        <li><strong>Wallet Payments:</strong> 1-3 business days</li>
                    </ul>

                    <h2>9. Store Credit Option</h2>
                    <p>
                        As an alternative to refunds, we offer store credit with a 10% bonus that can be used for future purchases.
                        The credit never expires and can be used across all our products and services.
                    </p>

                    <h2>10. Seasonal Factors</h2>
                    <p>
                        Please note that certain flowers have natural seasonal variations:
                    </p>
                    <ul>
                        <li>Color intensity may vary based on growing conditions</li>
                        <li>Bloom size can differ based on maturity and variety</li>
                        <li>Stem length may vary within natural ranges</li>
                    </ul>
                    <p>
                        These natural variations are not considered defects and do not qualify for refunds or replacements.
                    </p>

                    <h2>11. Questions?</h2>
                    <p>
                        If you have any questions about our refund and return policy, please don't hesitate to contact us.
                        We're here to ensure your complete satisfaction.
                    </p>
                </div>
            </section>
            <Footer />
        </main>
    );
}
