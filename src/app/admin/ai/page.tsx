"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Bot } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";


import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Separator } from "~/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { toast } from "sonner";

const toneOptions = [
    { value: "friendly", label: "Friendly & Warm" },
    { value: "professional", label: "Professional" },
    { value: "luxurious", label: "Luxurious & Elegant" },
    { value: "casual", label: "Casual & Relaxed" },
];

interface AISettingsFormData {
    enabled: boolean;
    systemPrompt: string;
    tone: string;
    maxMemoryChunks: number;
}

const defaultSystemPrompt = `You are Grace, the AI assistant for Grace Blooms, a luxury floral boutique. You help customers with:
- Information about our floral arrangements and services
- Recommendations based on occasions (weddings, birthdays, sympathy, etc.)
- Pricing inquiries and customization options
- Delivery information and lead times
- Guiding customers to contact us via WhatsApp, phone, or email to place orders

Be warm, helpful, and knowledgeable about flowers. Always encourage customers to reach out directly for orders and quotes.`;

export default function AdminAIPage() {
    const aiSettings = useQuery(api.ai.getSettings, {});
    const updateSettings = useMutation(api.ai.updateSettings);

    const [formData, setFormData] = React.useState<AISettingsFormData>({
        enabled: true,
        systemPrompt: defaultSystemPrompt,
        tone: "friendly",
        maxMemoryChunks: 10,
    });
    const [isSaving, setIsSaving] = React.useState(false);

    // Load settings into form
    React.useEffect(() => {
        if (aiSettings) {
            setFormData({
                enabled: aiSettings.enabled,
                systemPrompt: aiSettings.systemPrompt || defaultSystemPrompt,
                tone: aiSettings.tone || "friendly",
                maxMemoryChunks: aiSettings.maxMemoryChunks || 10,
            });
        }
    }, [aiSettings]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await updateSettings(formData);
            toast.success("AI settings saved successfully");
        } catch {
            toast.error("Failed to save AI settings");
        } finally {
            setIsSaving(false);
        }
    };

    const isLoading = aiSettings === undefined;

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background">

                <div className="container mx-auto px-6 pt-28 pb-16">
                    <div className="max-w-2xl mx-auto space-y-6">
                        {Array.from({ length: 4 }).map((_, i) => (
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


            <div className="container mx-auto px-6 pt-28 pb-16">
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
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/20">
                                <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h1 className="font-serif text-3xl font-bold">AI Bot Settings</h1>
                                <p className="text-muted-foreground">
                                    Configure your AI assistant behavior
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Enable/Disable */}
                        <div className="rounded-2xl border bg-card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="font-serif text-xl font-bold">AI Assistant</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Enable or disable the AI chat widget on your site
                                    </p>
                                </div>
                                <Switch
                                    checked={formData.enabled}
                                    onCheckedChange={(checked) =>
                                        setFormData((prev) => ({ ...prev, enabled: checked }))
                                    }
                                />
                            </div>
                        </div>

                        <Separator />

                        {/* System Prompt */}
                        <div className="rounded-2xl border bg-card p-6">
                            <h2 className="font-serif text-xl font-bold mb-4">System Prompt</h2>
                            <p className="text-sm text-muted-foreground mb-4">
                                This defines how the AI assistant behaves and responds to customers.
                            </p>
                            <div className="space-y-2">
                                <Label htmlFor="systemPrompt">Prompt</Label>
                                <Textarea
                                    id="systemPrompt"
                                    value={formData.systemPrompt}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, systemPrompt: e.target.value }))
                                    }
                                    rows={10}
                                    className="font-mono text-sm"
                                />
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="mt-2"
                                onClick={() =>
                                    setFormData((prev) => ({ ...prev, systemPrompt: defaultSystemPrompt }))
                                }
                            >
                                Reset to Default
                            </Button>
                        </div>

                        <Separator />

                        {/* Tone & Behavior */}
                        <div className="rounded-2xl border bg-card p-6">
                            <h2 className="font-serif text-xl font-bold mb-4">Tone & Behavior</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Conversation Tone</Label>
                                    <Select
                                        value={formData.tone}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({ ...prev, tone: value }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {toneOptions.map((tone) => (
                                                <SelectItem key={tone.value} value={tone.value}>
                                                    {tone.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="memoryChunks">Memory Limit (chunks per user)</Label>
                                    <Input
                                        id="memoryChunks"
                                        type="number"
                                        min={1}
                                        max={50}
                                        value={formData.maxMemoryChunks}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                maxMemoryChunks: parseInt(e.target.value) || 10,
                                            }))
                                        }
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Maximum conversation history chunks to remember per user (1-50)
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Info */}
                        <div className="rounded-2xl border bg-muted/30 p-6">
                            <h3 className="font-medium mb-2">How it works</h3>
                            <ul className="text-sm text-muted-foreground space-y-2">
                                <li>• The AI assistant uses your catalog, services, and FAQ data to answer questions</li>
                                <li>• Only authenticated users can chat with the bot</li>
                                <li>• Each user has isolated memory that persists across sessions</li>
                                <li>• The bot appears on public pages like home, catalog, and services</li>
                            </ul>
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
                                    Save AI Settings
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>


        </main>
    );
}
