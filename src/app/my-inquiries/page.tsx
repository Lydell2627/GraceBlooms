"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    MessageSquare,
    Phone,
    Mail,
    Calendar,
    MapPin,
    Palette,
    DollarSign,
    CheckCircle2,
    Clock,
    XCircle,
    ArrowLeft,
    Flower2,
    Package,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { useAuth } from "~/app/_components/AuthProvider";
import { Navbar } from "~/components/layout/Navbar";
import { Footer } from "~/components/layout/Footer";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { ScrollReveal } from "~/components/ui/scroll-reveal";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";

function getStatusColor(status: string) {
    switch (status) {
        case "NEW":
            return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        case "SENT":
            return "bg-green-500/10 text-green-500 border-green-500/20";
        case "FAILED":
            return "bg-red-500/10 text-red-500 border-red-500/20";
        case "CLOSED":
            return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        default:
            return "bg-muted text-muted-foreground";
    }
}

function getStatusIcon(status: string) {
    switch (status) {
        case "NEW":
            return <Clock className="h-3 w-3" />;
        case "SENT":
            return <CheckCircle2 className="h-3 w-3" />;
        case "FAILED":
            return <XCircle className="h-3 w-3" />;
        case "CLOSED":
            return <CheckCircle2 className="h-3 w-3" />;
        default:
            return null;
    }
}

function getStatusLabel(status: string) {
    switch (status) {
        case "NEW":
            return "Pending Review";
        case "SENT":
            return "Being Processed";
        case "FAILED":
            return "Issue Occurred";
        case "CLOSED":
            return "Completed";
        default:
            return status;
    }
}

export default function MyInquiriesPage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const inquiries = useQuery(
        api.inquiries.getUserInquiries,
        user?.id ? { userId: user.id } : "skip"
    );
    const [selectedInquiry, setSelectedInquiry] = React.useState<any>(null);
    const [detailsOpen, setDetailsOpen] = React.useState(false);

    // Loading state
    if (authLoading) {
        return (
            <main className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-6 pt-28 pb-16">
                    <div className="flex items-center justify-center py-20">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    // Not authenticated
    if (!isAuthenticated) {
        return (
            <main className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-6 pt-28 pb-16">
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
                            <MessageSquare className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Sign In Required</h1>
                        <p className="text-muted-foreground mb-6 max-w-md">
                            Please sign in to view your inquiry history. Your past conversations and orders are saved securely.
                        </p>
                        <Button asChild>
                            <Link href="/sign-in?redirect=/my-inquiries">Sign In</Link>
                        </Button>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <div className="container mx-auto px-6 pt-28 pb-16">
                {/* Header */}
                <ScrollReveal>
                    <div className="mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                <MessageSquare className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold font-serif">My Inquiries</h1>
                                <p className="text-muted-foreground">
                                    Track your flower arrangement requests
                                </p>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Inquiries List */}
                {!inquiries ? (
                    <div className="grid gap-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
                        ))}
                    </div>
                ) : inquiries.length === 0 ? (
                    <ScrollReveal>
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                                    <Package className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No Inquiries Yet</h3>
                                <p className="text-muted-foreground mb-6 max-w-md">
                                    Start a conversation with our AI assistant to create your first flower arrangement inquiry!
                                </p>
                                <Button asChild>
                                    <Link href="/catalog">Browse Catalog</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </ScrollReveal>
                ) : (
                    <div className="space-y-4">
                        {inquiries.map((inquiry, index) => (
                            <ScrollReveal key={inquiry._id} delay={index * 0.05}>
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Card
                                        className="cursor-pointer hover:border-primary/50 transition-colors"
                                        onClick={() => {
                                            setSelectedInquiry(inquiry);
                                            setDetailsOpen(true);
                                        }}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                {/* Left: Info */}
                                                <div className="space-y-3 flex-1">
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <Badge variant="outline" className={getStatusColor(inquiry.status)}>
                                                            {getStatusIcon(inquiry.status)}
                                                            <span className="ml-1">{getStatusLabel(inquiry.status)}</span>
                                                        </Badge>
                                                        <span className="text-sm text-muted-foreground">
                                                            {inquiry.referenceId}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {inquiry.occasion && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                                <span>{inquiry.occasion}</span>
                                                            </div>
                                                        )}
                                                        {(inquiry.budgetMin || inquiry.budgetMax) && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                                <span>₹{inquiry.budgetMin || 0} - ₹{inquiry.budgetMax || "∞"}</span>
                                                            </div>
                                                        )}
                                                        {inquiry.preferredColors && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Palette className="h-4 w-4 text-muted-foreground" />
                                                                <span>{inquiry.preferredColors}</span>
                                                            </div>
                                                        )}
                                                        {inquiry.deliveryArea && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                                <span className="truncate max-w-[200px]">{inquiry.deliveryArea}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <p className="text-xs text-muted-foreground">
                                                        Created on {new Date(inquiry.createdAt).toLocaleDateString("en-IN", {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        })}
                                                    </p>
                                                </div>

                                                {/* Right: Arrow indicator */}
                                                <div className="hidden sm:flex items-center">
                                                    <div className="text-muted-foreground">
                                                        <ArrowLeft className="h-5 w-5 rotate-180" />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </ScrollReveal>
                        ))}
                    </div>
                )}

                {/* Help Section */}
                <ScrollReveal delay={0.3}>
                    <Card className="mt-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Flower2 className="h-8 w-8 text-primary" />
                                    <div>
                                        <h3 className="font-semibold">Need Help?</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Our team is here to assist with your inquiries
                                        </p>
                                    </div>
                                </div>
                                <Button asChild variant="outline">
                                    <Link href="/contact">Contact Us</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </ScrollReveal>
            </div>

            {/* Details Dialog */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Inquiry Details</DialogTitle>
                        <DialogDescription>
                            Reference: {selectedInquiry?.referenceId}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedInquiry && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getStatusColor(selectedInquiry.status)}>
                                    {getStatusIcon(selectedInquiry.status)}
                                    <span className="ml-1">{getStatusLabel(selectedInquiry.status)}</span>
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                                    <p>{selectedInquiry.contactName}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                    <p>{selectedInquiry.contactPhone}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <p>{selectedInquiry.contactEmail}</p>
                                </div>
                            </div>

                            {(selectedInquiry.occasion || selectedInquiry.eventDateTime) && (
                                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                                    {selectedInquiry.occasion && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Occasion</p>
                                            <p>{selectedInquiry.occasion}</p>
                                        </div>
                                    )}
                                    {selectedInquiry.eventDateTime && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Event Date</p>
                                            <p>{selectedInquiry.eventDateTime}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {(selectedInquiry.budgetMin || selectedInquiry.budgetMax) && (
                                <div className="pt-2 border-t">
                                    <p className="text-sm font-medium text-muted-foreground">Budget Range</p>
                                    <p>₹{selectedInquiry.budgetMin || 0} - ₹{selectedInquiry.budgetMax || "No limit"}</p>
                                </div>
                            )}

                            {selectedInquiry.preferredColors && (
                                <div className="pt-2 border-t">
                                    <p className="text-sm font-medium text-muted-foreground">Preferred Colors</p>
                                    <p>{selectedInquiry.preferredColors}</p>
                                </div>
                            )}

                            {selectedInquiry.deliveryArea && (
                                <div className="pt-2 border-t">
                                    <p className="text-sm font-medium text-muted-foreground">Delivery Location</p>
                                    <p className="break-all">{selectedInquiry.deliveryArea}</p>
                                </div>
                            )}

                            {selectedInquiry.messageNote && (
                                <div className="pt-2 border-t">
                                    <p className="text-sm font-medium text-muted-foreground">Additional Notes</p>
                                    <p className="whitespace-pre-wrap">{selectedInquiry.messageNote}</p>
                                </div>
                            )}

                            <div className="pt-2 border-t text-xs text-muted-foreground">
                                Created: {new Date(selectedInquiry.createdAt).toLocaleString("en-IN")}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Footer />
        </main>
    );
}
