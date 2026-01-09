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

export default function AdminInquiriesPage() {
    const inquiries = useQuery(api.inquiries.listAll, {});
    const updateStatus = useMutation(api.inquiries.updateInquiryStatus);
    const [selectedInquiry, setSelectedInquiry] = React.useState<NonNullable<typeof inquiries>[number] | null>(null);
    const [detailsOpen, setDetailsOpen] = React.useState(false);

    const handleStatusChange = async (inquiryId: Id<"inquiries">, newStatus: string) => {
        await updateStatus({ inquiryId, status: newStatus });
    };

    if (!inquiries) {
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Inquiries</h1>
                        <p className="text-muted-foreground">
                            {inquiries.length} total inquiries from AI bot
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">
                            {inquiries.filter((i) => i.status === "NEW").length}
                        </div>
                        <p className="text-sm text-muted-foreground">New</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">
                            {inquiries.filter((i) => i.status === "SENT").length}
                        </div>
                        <p className="text-sm text-muted-foreground">Sent</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">
                            {inquiries.filter((i) => i.status === "CLOSED").length}
                        </div>
                        <p className="text-sm text-muted-foreground">Closed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">
                            {inquiries.filter((i) => i.status === "FAILED").length}
                        </div>
                        <p className="text-sm text-muted-foreground">Failed</p>
                    </CardContent>
                </Card>
            </div>

            {/* Inquiries List */}
            {inquiries.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 font-semibold">No Inquiries Yet</h3>
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

            {/* Details Dialog */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Inquiry Details</DialogTitle>
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
        </div>
    );
}
