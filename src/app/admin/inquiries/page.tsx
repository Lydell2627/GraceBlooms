"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
    MessageSquare,
    Phone,
    Mail,
    Calendar,
    CheckCircle2,
    Clock,
    XCircle,
    Eye,
    Send,
    Bot,
    FileText,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { ScrollReveal } from "~/components/ui/scroll-reveal";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "~/components/ui/tabs";

function getStatusColor(status: string) {
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
        case "NEW":
            return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        case "SENT":
            return "bg-green-500/10 text-green-500 border-green-500/20";
        case "CONTACTED":
            return "bg-green-500/10 text-green-500 border-green-500/20";
        case "FAILED":
            return "bg-red-500/10 text-red-500 border-red-500/20";
        case "CLOSED":
        case "RESOLVED":
            return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        default:
            return "bg-muted text-muted-foreground";
    }
}

function getStatusIcon(status: string) {
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
        case "NEW":
            return <Clock className="h-3 w-3" />;
        case "SENT":
        case "CONTACTED":
            return <CheckCircle2 className="h-3 w-3" />;
        case "FAILED":
            return <XCircle className="h-3 w-3" />;
        case "CLOSED":
        case "RESOLVED":
            return <CheckCircle2 className="h-3 w-3" />;
        default:
            return null;
    }
}

export default function AdminInquiriesPage() {
    // AI Bot Inquiries
    const inquiries = useQuery(api.inquiries.listAll, {});
    const updateStatus = useMutation(api.inquiries.updateInquiryStatus);

    // Contact Form Inquiries
    const contactInquiries = useQuery(api.contact.list, {});
    const updateContactStatus = useMutation(api.contact.updateStatus);

    const [selectedInquiry, setSelectedInquiry] = React.useState<NonNullable<typeof inquiries>[number] | null>(null);
    const [selectedContactInquiry, setSelectedContactInquiry] = React.useState<NonNullable<typeof contactInquiries>[number] | null>(null);
    const [detailsOpen, setDetailsOpen] = React.useState(false);
    const [contactDetailsOpen, setContactDetailsOpen] = React.useState(false);

    const handleStatusChange = async (inquiryId: Id<"inquiries">, newStatus: string) => {
        try {
            console.log("Updating AI Bot inquiry status:", { inquiryId, newStatus });
            await updateStatus({ inquiryId, status: newStatus });
            console.log("Status updated successfully");
        } catch (error) {
            console.error("Failed to update AI Bot inquiry status:", error);
        }
    };

    const handleContactStatusChange = async (id: Id<"contactInquiries">, newStatus: string) => {
        try {
            console.log("Updating Contact inquiry status:", { id, newStatus });
            await updateContactStatus({ id, status: newStatus });
            console.log("Contact status updated successfully");
        } catch (error) {
            console.error("Failed to update Contact inquiry status:", error);
        }
    };

    const isLoading = inquiries === undefined || contactInquiries === undefined;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Inquiries</h1>
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                </div>
                <div className="grid gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
                    ))}
                </div>
            </div>
        );
    }

    const totalInquiries = (inquiries?.length || 0) + (contactInquiries?.length || 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">All Inquiries</h1>
                        <p className="text-muted-foreground">
                            {totalInquiries} total inquiries
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs for different inquiry sources */}
            <Tabs defaultValue="contact" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="contact" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Contact Form ({contactInquiries?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="bot" className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        AI Bot ({inquiries?.length || 0})
                    </TabsTrigger>
                </TabsList>

                {/* Contact Form Inquiries Tab */}
                <TabsContent value="contact" className="space-y-6">
                    {/* Stats for Contact */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold">
                                    {contactInquiries?.filter((i) => i.status === "new").length || 0}
                                </div>
                                <p className="text-sm text-muted-foreground">New</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold">
                                    {contactInquiries?.filter((i) => i.status === "contacted").length || 0}
                                </div>
                                <p className="text-sm text-muted-foreground">Contacted</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold">
                                    {contactInquiries?.filter((i) => i.status === "resolved").length || 0}
                                </div>
                                <p className="text-sm text-muted-foreground">Resolved</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Inquiries List */}
                    {!contactInquiries || contactInquiries.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <FileText className="h-12 w-12 text-muted-foreground/50" />
                                <h3 className="mt-4 font-semibold">No Contact Form Inquiries</h3>
                                <p className="text-sm text-muted-foreground">
                                    Contact form submissions will appear here
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {contactInquiries.map((inquiry, index) => (
                                <ScrollReveal key={inquiry._id} delay={index * 0.05}>
                                    <motion.div
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                    {/* Left: Info */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-semibold">{inquiry.name}</h3>
                                                            <Badge variant="outline" className={getStatusColor(inquiry.status)}>
                                                                {getStatusIcon(inquiry.status)}
                                                                <span className="ml-1 capitalize">{inquiry.status}</span>
                                                            </Badge>
                                                            <Badge variant="secondary" className="text-xs">
                                                                {inquiry.source === "contact_form" ? "Contact Form" : inquiry.source}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Mail className="h-3 w-3" />
                                                                {inquiry.email}
                                                            </span>
                                                            {inquiry.phone && (
                                                                <span className="flex items-center gap-1">
                                                                    <Phone className="h-3 w-3" />
                                                                    {inquiry.phone}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                                            {inquiry.message}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(inquiry.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>

                                                    {/* Right: Actions */}
                                                    <div className="flex items-center gap-2">
                                                        <Select
                                                            value={inquiry.status}
                                                            onValueChange={(value) => handleContactStatusChange(inquiry._id, value)}
                                                        >
                                                            <SelectTrigger className="w-[120px]">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="new">New</SelectItem>
                                                                <SelectItem value="contacted">Contacted</SelectItem>
                                                                <SelectItem value="resolved">Resolved</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => {
                                                                setSelectedContactInquiry(inquiry);
                                                                setContactDetailsOpen(true);
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </ScrollReveal>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* AI Bot Inquiries Tab */}
                <TabsContent value="bot" className="space-y-6">
                    {/* Stats for Bot */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold">
                                    {inquiries?.filter((i) => i.status === "NEW").length || 0}
                                </div>
                                <p className="text-sm text-muted-foreground">New</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold">
                                    {inquiries?.filter((i) => i.status === "SENT").length || 0}
                                </div>
                                <p className="text-sm text-muted-foreground">Sent</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold">
                                    {inquiries?.filter((i) => i.status === "CLOSED").length || 0}
                                </div>
                                <p className="text-sm text-muted-foreground">Closed</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold">
                                    {inquiries?.filter((i) => i.status === "FAILED").length || 0}
                                </div>
                                <p className="text-sm text-muted-foreground">Failed</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Bot Inquiries List */}
                    {!inquiries || inquiries.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Bot className="h-12 w-12 text-muted-foreground/50" />
                                <h3 className="mt-4 font-semibold">No AI Bot Inquiries</h3>
                                <p className="text-sm text-muted-foreground">
                                    Inquiries from the AI bot will appear here
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {inquiries.map((inquiry, index) => (
                                <ScrollReveal key={inquiry._id} delay={index * 0.05}>
                                    <motion.div
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                    {/* Left: Info */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-semibold">{inquiry.contactName}</h3>
                                                            <Badge variant="outline" className={getStatusColor(inquiry.status)}>
                                                                {getStatusIcon(inquiry.status)}
                                                                <span className="ml-1">{inquiry.status}</span>
                                                            </Badge>
                                                        </div>
                                                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Phone className="h-3 w-3" />
                                                                {inquiry.contactPhone}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Mail className="h-3 w-3" />
                                                                {inquiry.contactEmail}
                                                            </span>
                                                            {inquiry.occasion && (
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="h-3 w-3" />
                                                                    {inquiry.occasion}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Ref: {inquiry.referenceId} • {new Date(inquiry.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>

                                                    {/* Right: Actions */}
                                                    <div className="flex items-center gap-2">
                                                        <Select
                                                            value={inquiry.status}
                                                            onValueChange={(value) => handleStatusChange(inquiry._id, value)}
                                                        >
                                                            <SelectTrigger className="w-[120px]">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="NEW">New</SelectItem>
                                                                <SelectItem value="SENT">Sent</SelectItem>
                                                                <SelectItem value="CLOSED">Closed</SelectItem>
                                                                <SelectItem value="FAILED">Failed</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => {
                                                                setSelectedInquiry(inquiry);
                                                                setDetailsOpen(true);
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </ScrollReveal>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* AI Bot Details Dialog */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>AI Bot Inquiry Details</DialogTitle>
                        <DialogDescription>
                            Reference: {selectedInquiry?.referenceId}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedInquiry && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                                    <p>{selectedInquiry.contactName}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                                    <Badge variant="outline" className={getStatusColor(selectedInquiry.status)}>
                                        {selectedInquiry.status}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                    <p>{selectedInquiry.contactPhone}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <p>{selectedInquiry.contactEmail}</p>
                                </div>
                            </div>

                            {(selectedInquiry.occasion || selectedInquiry.eventDateTime) && (
                                <div className="grid grid-cols-2 gap-4">
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
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Budget Range</p>
                                    <p>₹{selectedInquiry.budgetMin || 0} - ₹{selectedInquiry.budgetMax || "No limit"}</p>
                                </div>
                            )}

                            {selectedInquiry.preferredColors && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Preferred Colors</p>
                                    <p>{selectedInquiry.preferredColors}</p>
                                </div>
                            )}

                            {selectedInquiry.deliveryArea && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Delivery Location</p>
                                    <p className="break-all">{selectedInquiry.deliveryArea}</p>
                                </div>
                            )}

                            {selectedInquiry.messageNote && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Additional Notes</p>
                                    <p className="whitespace-pre-wrap">{selectedInquiry.messageNote}</p>
                                </div>
                            )}

                            <div className="text-xs text-muted-foreground">
                                Created: {new Date(selectedInquiry.createdAt).toLocaleString()}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Contact Form Details Dialog */}
            <Dialog open={contactDetailsOpen} onOpenChange={setContactDetailsOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Contact Form Inquiry</DialogTitle>
                        <DialogDescription>
                            From: {selectedContactInquiry?.name}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedContactInquiry && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                                    <p>{selectedContactInquiry.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                                    <Badge variant="outline" className={getStatusColor(selectedContactInquiry.status)}>
                                        <span className="capitalize">{selectedContactInquiry.status}</span>
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <p>{selectedContactInquiry.email}</p>
                                </div>
                                {selectedContactInquiry.phone && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                        <p>{selectedContactInquiry.phone}</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Message</p>
                                <p className="whitespace-pre-wrap mt-1 p-3 bg-muted rounded-lg">
                                    {selectedContactInquiry.message}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Source</p>
                                <p className="capitalize">{selectedContactInquiry.source.replace("_", " ")}</p>
                            </div>

                            <div className="text-xs text-muted-foreground">
                                Received: {new Date(selectedContactInquiry.createdAt).toLocaleString()}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
