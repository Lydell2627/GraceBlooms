import { Navbar } from "~/components/layout/Navbar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea"; // Assuming you might have a Textarea component, or I'll use standard textarea with class
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <section className="container mx-auto px-6 py-24">
                <div className="max-w-5xl mx-auto">
                    <h1 className="font-serif text-5xl font-bold text-center mb-16">Get in Touch</h1>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-6 font-serif">Visit Our Studio</h2>
                                <p className="text-muted-foreground mb-8">
                                    We'd love to meet you. Drop by our studio to see our latest creations or discuss your custom arrangement needs.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 text-primary mt-1" />
                                    <div>
                                        <h3 className="font-bold">Address</h3>
                                        <p className="text-muted-foreground">
                                            123 Flower District,<br />
                                            New York, NY 10001
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Mail className="w-6 h-6 text-primary mt-1" />
                                    <div>
                                        <h3 className="font-bold">Email</h3>
                                        <p className="text-muted-foreground">hello@noirbotanica.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Phone className="w-6 h-6 text-primary mt-1" />
                                    <div>
                                        <h3 className="font-bold">Phone</h3>
                                        <p className="text-muted-foreground">(555) 123-4567</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-muted/30 p-8 rounded-2xl border">
                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                                    <Input id="name" placeholder="Your name" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                                    <Input id="email" type="email" placeholder="your@email.com" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="How can we help you?"
                                    />
                                </div>
                                <Button type="submit" className="w-full">Send Message</Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
