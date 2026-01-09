"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { SUPPORTED_CURRENCIES } from "~/lib/currency";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { toast } from "sonner";

interface SettingsFormData {
    whatsappNumber: string;
    phoneNumber: string;
    email: string;
    baseCurrency: string;
    heroHeadline: string;
    heroSubheadline: string;
    trustBadge1Title: string;
    trustBadge1Desc: string;
    trustBadge2Title: string;
    trustBadge2Desc: string;
    trustBadge3Title: string;
    trustBadge3Desc: string;
    businessHours: string;
    location: string;
    instagramUrl: string;
    facebookUrl: string;
    pinterestUrl: string;
}

export default function AdminSettingsPage() {
    const settings = useQuery(api.settings.get, {});
    const updateSettings = useMutation(api.settings.update);
    const initializeSettings = useMutation(api.settings.initialize);

    const [formData, setFormData] = React.useState<SettingsFormData>({
        whatsappNumber: "",
        phoneNumber: "",
        email: "",
        baseCurrency: "INR",
        heroHeadline: "",
        heroSubheadline: "",
        trustBadge1Title: "",
        trustBadge1Desc: "",
        trustBadge2Title: "",
        trustBadge2Desc: "",
        trustBadge3Title: "",
        trustBadge3Desc: "",
        businessHours: "",
        location: "",
        instagramUrl: "",
        facebookUrl: "",
        pinterestUrl: "",
    });
    const [isSaving, setIsSaving] = React.useState(false);
    const [initialized, setInitialized] = React.useState(false);

    // Initialize settings if none exist
    React.useEffect(() => {
        if (settings === null && !initialized) {
            initializeSettings({}).then(() => {
                setInitialized(true);
            });
        }
    }, [settings, initialized, initializeSettings]);

    // Load settings into form
    React.useEffect(() => {
        if (settings) {
            const socialLinks = settings.socialLinks || {};
            const trustBadges = settings.trustBadges || [];

            setFormData({
                whatsappNumber: settings.whatsappNumber || "",
                phoneNumber: settings.phoneNumber || "",
                email: settings.email || "",
                baseCurrency: settings.baseCurrency || "INR",
                heroHeadline: settings.heroHeadline || "",
                heroSubheadline: settings.heroSubheadline || "",
                trustBadge1Title: trustBadges[0]?.title || "",
                trustBadge1Desc: trustBadges[0]?.description || "",
                trustBadge2Title: trustBadges[1]?.title || "",
                trustBadge2Desc: trustBadges[1]?.description || "",
                trustBadge3Title: trustBadges[2]?.title || "",
                trustBadge3Desc: trustBadges[2]?.description || "",
                businessHours: settings.businessHours || "",
                location: settings.location || "",
                instagramUrl: socialLinks.instagram || "",
                facebookUrl: socialLinks.facebook || "",
                pinterestUrl: socialLinks.pinterest || "",
            });
        }
    }, [settings]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await updateSettings({
                whatsappNumber: formData.whatsappNumber || undefined,
                phoneNumber: formData.phoneNumber || undefined,
                email: formData.email || undefined,
                baseCurrency: formData.baseCurrency || undefined,
                heroHeadline: formData.heroHeadline || undefined,
                heroSubheadline: formData.heroSubheadline || undefined,
                trustBadges: [
                    { icon: "Sparkles", title: formData.trustBadge1Title, description: formData.trustBadge1Desc },
                    { icon: "Truck", title: formData.trustBadge2Title, description: formData.trustBadge2Desc },
                    { icon: "Shield", title: formData.trustBadge3Title, description: formData.trustBadge3Desc },
                ].filter(b => b.title),
                businessHours: formData.businessHours || undefined,
                location: formData.location || undefined,
                socialLinks: {
                    instagram: formData.instagramUrl || undefined,
                    facebook: formData.facebookUrl || undefined,
                    pinterest: formData.pinterestUrl || undefined,
                },
            });
            toast.success("Settings saved successfully");
        } catch {
            toast.error("Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    const isLoading = settings === undefined;

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background">

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                    <div className="max-w-2xl mx-auto space-y-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                                <div className="h-10 rounded bg-muted animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">


            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href="/admin"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Link>
                        <h1 className="font-serif text-3xl font-bold">Site Settings</h1>
                        <p className="text-muted-foreground">
                            Configure contact info, hero content, and site details
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Contact Information */}
                        <div className="rounded-2xl border bg-card p-6">
                            <h2 className="font-serif text-xl font-bold mb-4">Contact Information</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                                    <Input
                                        id="whatsapp"
                                        value={formData.whatsappNumber}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, whatsappNumber: e.target.value }))
                                        }
                                        placeholder="919876543210"
                                    />
                                    <p className="text-xs text-muted-foreground">Include country code without + or spaces</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phoneNumber}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))
                                        }
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, email: e.target.value }))
                                        }
                                        placeholder="hello@graceblooms.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Hero Content */}
                        <div className="rounded-2xl border bg-card p-6">
                            <h2 className="font-serif text-xl font-bold mb-4">Hero Content</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="headline">Hero Headline</Label>
                                    <Input
                                        id="headline"
                                        value={formData.heroHeadline}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, heroHeadline: e.target.value }))
                                        }
                                        placeholder="Emotions in Full Bloom"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subheadline">Hero Subheadline</Label>
                                    <Textarea
                                        id="subheadline"
                                        value={formData.heroSubheadline}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, heroSubheadline: e.target.value }))
                                        }
                                        placeholder="Hand-crafted arrangements that speak the language of the heart..."
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Currency Settings */}
                        <div className="rounded-2xl border bg-card p-6">
                            <h2 className="font-serif text-xl font-bold mb-4">Currency Settings</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="baseCurrency">Base Currency</Label>
                                    <Select
                                        value={formData.baseCurrency}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({ ...prev, baseCurrency: value }))
                                        }
                                    >
                                        <SelectTrigger id="baseCurrency">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(SUPPORTED_CURRENCIES).map(([code, info]) => (
                                                <SelectItem key={code} value={code}>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">{info.symbol}</span>
                                                        <span className="font-medium">{code}</span>
                                                        <span className="text-muted-foreground">- {info.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        All catalog prices should be entered in this currency. Users can view prices in their preferred currency.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Trust Badges */}
                        <div className="rounded-2xl border bg-card p-6">
                            <h2 className="font-serif text-xl font-bold mb-4">Trust Badges</h2>
                            <div className="space-y-6">
                                {[1, 2, 3].map((num) => (
                                    <div key={num} className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Badge {num} Title</Label>
                                            <Input
                                                value={formData[`trustBadge${num}Title` as keyof SettingsFormData] as string}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        [`trustBadge${num}Title`]: e.target.value,
                                                    }))
                                                }
                                                placeholder="Freshness Guaranteed"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Badge {num} Description</Label>
                                            <Input
                                                value={formData[`trustBadge${num}Desc` as keyof SettingsFormData] as string}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        [`trustBadge${num}Desc`]: e.target.value,
                                                    }))
                                                }
                                                placeholder="Sourced directly from local growers"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Business Info */}
                        <div className="rounded-2xl border bg-card p-6">
                            <h2 className="font-serif text-xl font-bold mb-4">Business Information</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="hours">Business Hours</Label>
                                    <Input
                                        id="hours"
                                        value={formData.businessHours}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, businessHours: e.target.value }))
                                        }
                                        placeholder="Mon-Sat: 9AM - 8PM, Sun: 10AM - 6PM"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Textarea
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, location: e.target.value }))
                                        }
                                        placeholder="123 Blossom Street, Garden District, City - 400001"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Social Links */}
                        <div className="rounded-2xl border bg-card p-6">
                            <h2 className="font-serif text-xl font-bold mb-4">Social Links</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="instagram">Instagram URL</Label>
                                    <Input
                                        id="instagram"
                                        value={formData.instagramUrl}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, instagramUrl: e.target.value }))
                                        }
                                        placeholder="https://instagram.com/graceblooms"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="facebook">Facebook URL</Label>
                                    <Input
                                        id="facebook"
                                        value={formData.facebookUrl}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, facebookUrl: e.target.value }))
                                        }
                                        placeholder="https://facebook.com/graceblooms"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pinterest">Pinterest URL</Label>
                                    <Input
                                        id="pinterest"
                                        value={formData.pinterestUrl}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, pinterestUrl: e.target.value }))
                                        }
                                        placeholder="https://pinterest.com/graceblooms"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <Button type="submit" size="lg" className="w-full" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Settings
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>


        </main>
    );
}
