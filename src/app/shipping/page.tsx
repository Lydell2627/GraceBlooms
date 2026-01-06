"use client";

import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { Truck, Clock, MapPin, Phone } from "lucide-react";

export default function ShippingPage() {
    const settings = useQuery(api.settings.get, {});
    const contactEmail = settings?.email || "hello@graceblooms.com";
    const contactPhone = settings?.phoneNumber || "+91 98765 43210";

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
                    <h1 className="font-serif text-4xl font-bold mb-8">Shipping & Delivery Policy</h1>
                    <p className="text-muted-foreground mb-8">Last Updated: January 2026</p>

                    <div className="not-prose grid gap-6 md:grid-cols-2 mb-12">
                        <div className="rounded-2xl border bg-card p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <Truck className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-serif text-xl font-bold">Same Day Delivery</h3>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                Order by 2 PM for same-day delivery in select areas
                            </p>
                        </div>
                        <div className="rounded-2xl border bg-card p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <Clock className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-serif text-xl font-bold">Scheduled Delivery</h3>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                Book in advance for specific dates and time windows
                            </p>
                        </div>
                    </div>

                    <h2>1. Delivery Areas</h2>
                    <p>
                        We currently deliver to the following areas. Please contact us to confirm delivery availability for
                        your specific location:
                    </p>
                    <ul>
                        <li>Local city and surrounding suburbs (within 25 km radius)</li>
                        <li>Extended metro area (additional charges may apply)</li>
                        <li>Special event locations (venue delivery available)</li>
                    </ul>
                    <p>
                        For deliveries outside our standard service area, please contact us at{" "}
                        <a href={`tel:${contactPhone}`} className="text-primary hover:underline">{contactPhone}</a> to discuss
                        custom arrangements.
                    </p>

                    <h2>2. Delivery Timing</h2>
                    <p><strong>Same-Day Delivery:</strong></p>
                    <ul>
                        <li>Orders must be placed by 2:00 PM</li>
                        <li>Available Monday through Saturday</li>
                        <li>Subject to product availability and delivery area</li>
                    </ul>

                    <p><strong>Scheduled Delivery:</strong></p>
                    <ul>
                        <li>Available for any future date</li>
                        <li>Choose specific delivery windows (morning, afternoon, evening)</li>
                        <li>Recommended for special occasions and events</li>
                    </ul>

                    <h2>3. Delivery Fees</h2>
                    <p>
                        Delivery charges vary based on distance and timing:
                    </p>
                    <ul>
                        <li><strong>Standard Delivery:</strong> Starting from ₹150</li>
                        <li><strong>Same-Day Delivery:</strong> Starting from ₹250</li>
                        <li><strong>Express Delivery (within 4 hours):</strong> Starting from ₹500</li>
                        <li><strong>Extended Area Delivery:</strong> Custom pricing based on location</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">
                        * Delivery fees are calculated at checkout based on your specific delivery address and selected timing.
                    </p>

                    <h2>4. Delivery Process</h2>
                    <p>
                        Our delivery process ensures your flowers arrive fresh and beautiful:
                    </p>
                    <ol>
                        <li><strong>Order Confirmation:</strong> You'll receive an order confirmation with estimated delivery time</li>
                        <li><strong>Preparation:</strong> Our florists prepare your arrangement fresh on the day of delivery</li>
                        <li><strong>Quality Check:</strong> Each arrangement undergoes a final quality inspection</li>
                        <li><strong>Delivery:</strong> Our delivery team carefully transports your flowers</li>
                        <li><strong>Delivery Confirmation:</strong> You'll receive notification when delivery is complete</li>
                    </ol>

                    <h2>5. Recipient Availability</h2>
                    <p>
                        We make every effort to deliver to the recipient directly. If the recipient is unavailable:
                    </p>
                    <ul>
                        <li>We'll attempt to leave flowers in a safe location (if authorized)</li>
                        <li>We may leave with a neighbor or building security (if appropriate)</li>
                        <li>If delivery cannot be made, we'll contact you for instructions</li>
                        <li>Additional delivery fees may apply for redelivery attempts</li>
                    </ul>

                    <h2>6. Special Instructions</h2>
                    <p>
                        You can provide special delivery instructions during checkout:
                    </p>
                    <ul>
                        <li>Gate codes or access information</li>
                        <li>Preferred safe drop-off location</li>
                        <li>Specific delivery timing preferences</li>
                        <li>Contact person at delivery location</li>
                    </ul>

                    <h2>7. Care Instructions</h2>
                    <p>
                        Each delivery includes care instructions to help your flowers last longer. Basic tips:
                    </p>
                    <ul>
                        <li>Trim stems at an angle before placing in water</li>
                        <li>Change water every 2-3 days</li>
                        <li>Keep flowers away from direct sunlight and heat</li>
                        <li>Remove wilted flowers promptly to maintain arrangement</li>
                    </ul>

                    <h2>8. Weather and External Factors</h2>
                    <p>
                        In extreme weather conditions (heavy rain, storms, extreme heat), delivery times may be adjusted to
                        ensure flower quality. We'll contact you if any delays are anticipated.
                    </p>

                    <h2>9. Contact Us</h2>
                    <p>
                        For delivery inquiries or to track your order:
                    </p>
                    <ul className="not-prose space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary" />
                            <a href={`tel:${contactPhone}`} className="text-primary hover:underline">{contactPhone}</a>
                        </li>
                        <li className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a>
                        </li>
                    </ul>
                </div>
            </section>
            <Footer />
        </main>
    );
}
