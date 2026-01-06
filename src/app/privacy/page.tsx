"use client";

import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import Link from "next/link";

export default function PrivacyPage() {
    const settings = useQuery(api.settings.get, {});
    const contactEmail = settings?.email || "hello@graceblooms.com";

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
                    <h1 className="font-serif text-4xl font-bold mb-8">Privacy Policy</h1>
                    <p className="text-muted-foreground mb-8">Last Updated: January 2026</p>

                    <h2>1. Introduction</h2>
                    <p>
                        At Grace Blooms, we respect your privacy and are committed to protecting the personal information you share with us.
                        This policy explains how we collect, use, store, and safeguard your data when you use our website and services.
                    </p>

                    <h2>2. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us when you create an account, make a purchase, submit an inquiry,
                        or subscribe to our newsletter. This includes:
                    </p>
                    <ul>
                        <li>Name and contact information (email, phone number)</li>
                        <li>Billing and shipping addresses</li>
                        <li>Payment information (processed securely by third-party providers)</li>
                        <li>Order history and preferences</li>
                        <li>Communications with our customer service team</li>
                        <li>AI chatbot conversation history (for personalized recommendations)</li>
                    </ul>

                    <p><strong>Automatically Collected Information:</strong></p>
                    <ul>
                        <li>Browser type and version</li>
                        <li>Device information and IP address</li>
                        <li>Pages visited and time spent on site</li>
                        <li>Referring website or source</li>
                        <li>Analytics data (via Vercel Analytics)</li>
                    </ul>

                    <h2>3. How We Use Your Information</h2>
                    <p>
                        We use your information to:
                    </p>
                    <ul>
                        <li>Process and fulfill your orders</li>
                        <li>Communicate with you about your account and purchases</li>
                        <li>Send you marketing communications (if you have opted in)</li>
                        <li>Provide personalized product recommendations via AI</li>
                        <li>Improve our website, products, and customer service</li>
                        <li>Detect and prevent fraud or security issues</li>
                        <li>Comply with legal obligations</li>
                    </ul>

                    <h2>4. Cookies and Tracking Technologies</h2>
                    <p>
                        We use cookies and similar tracking technologies to enhance your experience:
                    </p>
                    <ul>
                        <li><strong>Essential Cookies:</strong> Required for website functionality (authentication, shopping cart)</li>
                        <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site</li>
                        <li><strong>Preference Cookies:</strong> Remember your settings (currency preference, theme)</li>
                    </ul>
                    <p>
                        You can control cookies through your browser settings. Note that disabling certain cookies may affect website functionality.
                    </p>

                    <h2>5. Third-Party Services</h2>
                    <p>
                        We use trusted third-party services to operate our business:
                    </p>
                    <ul>
                        <li><strong>Convex:</strong> Database and backend services for storing inquiries and user data</li>
                        <li><strong>Vercel Analytics:</strong> Website analytics and performance monitoring</li>
                        <li><strong>Payment Processors:</strong> Secure payment processing (we do not store payment card details)</li>
                        <li><strong>Google Gemini AI:</strong> Powers our AI chatbot for customer assistance</li>
                        <li><strong>Email Service:</strong> For transactional and marketing emails</li>
                    </ul>
                    <p>
                        These services have their own privacy policies and data protection measures.
                    </p>

                    <h2>6. Data Security</h2>
                    <p>
                        We implement appropriate technical and organizational security measures to protect your personal information against
                        unauthorized access, alteration, disclosure, or destruction:
                    </p>
                    <ul>
                        <li>Encrypted data transmission (SSL/TLS)</li>
                        <li>Secure database storage</li>
                        <li>Regular security assessments</li>
                        <li>Access controls and authentication</li>
                        <li>Employee training on data protection</li>
                    </ul>

                    <h2>7. Data Retention</h2>
                    <p>
                        We retain your personal information for as long as necessary to:
                    </p>
                    <ul>
                        <li>Provide our services and maintain your account</li>
                        <li>Comply with legal obligations (tax, accounting requirements)</li>
                        <li>Resolve disputes and enforce agreements</li>
                    </ul>
                    <p>
                        Account data is retained while your account is active. Upon account deletion, personal data is removed within 90 days,
                        except where required by law.
                    </p>

                    <h2>8. Your Rights</h2>
                    <p>
                        You have the following rights regarding your personal data:
                    </p>
                    <ul>
                        <li><strong>Access:</strong> Request a copy of your personal data</li>
                        <li><strong>Rectification:</strong> Correct inaccurate or incomplete information</li>
                        <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                        <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
                        <li><strong>Objection:</strong> Object to processing of your personal data</li>
                        <li><strong>Withdraw Consent:</strong> Unsubscribe from marketing communications</li>
                    </ul>
                    <p>
                        To exercise these rights, contact us at <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a>.
                    </p>

                    <h2>9. Marketing Communications</h2>
                    <p>
                        With your consent, we may send you marketing emails about our products, special offers, and events.
                        You can opt-out at any time by:
                    </p>
                    <ul>
                        <li>Clicking the "unsubscribe" link in any marketing email</li>
                        <li>Updating your preferences in your account settings</li>
                        <li>Contacting us directly</li>
                    </ul>

                    <h2>10. Children's Privacy</h2>
                    <p>
                        Our services are not directed to children under 13 years of age. We do not knowingly collect personal information
                        from children. If you believe we have inadvertently collected such information, please contact us immediately.
                    </p>

                    <h2>11. International Data Transfers</h2>
                    <p>
                        Your information may be transferred to and processed in countries other than your country of residence.
                        We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy.
                    </p>

                    <h2>12. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a
                        notice on our website or sending you an email. Please review this policy periodically.
                    </p>

                    <h2>13. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy or our data practices, please contact us:
                    </p>
                    <ul className="not-prose space-y-2">
                        <li>Email: <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a></li>
                        <li>Phone: {settings?.phoneNumber || "+91 98765 43210"}</li>
                    </ul>

                    <div className="not-prose mt-8 p-6 rounded-2xl bg-muted/30 border">
                        <h3 className="font-serif text-xl font-bold mb-3">Related Policies</h3>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/terms" className="text-sm text-primary hover:underline">Terms of Service</Link>
                            <span className="text-muted-foreground">•</span>
                            <Link href="/refund" className="text-sm text-primary hover:underline">Refund Policy</Link>
                            <span className="text-muted-foreground">•</span>
                            <Link href="/shipping" className="text-sm text-primary hover:underline">Shipping Policy</Link>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
