"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Plus, Pencil, Trash2, ArrowLeft, Search, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";


import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "~/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { toast } from "sonner";

const categoryOptions = ["general", "ordering", "delivery", "customization", "events"];

interface FAQFormData {
    question: string;
    answer: string;
    category: string;
    sortOrder: number;
    published: boolean;
}

const defaultFormData: FAQFormData = {
    question: "",
    answer: "",
    category: "general",
    sortOrder: 0,
    published: true,
};

export default function AdminFAQPage() {
    const prefersReducedMotion = useReducedMotion();
    const [search, setSearch] = React.useState("");
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState<Id<"faq"> | null>(null);
    const [formData, setFormData] = React.useState<FAQFormData>(defaultFormData);
    const [expandedId, setExpandedId] = React.useState<string | null>(null);

    const faqItems = useQuery(api.faq.listAll, {});
    const createFAQ = useMutation(api.faq.create);
    const updateFAQ = useMutation(api.faq.update);
    const removeFAQ = useMutation(api.faq.remove);

    const isLoading = faqItems === undefined;

    const filteredItems = faqItems?.filter((item) =>
        item.question.toLowerCase().includes(search.toLowerCase()) ||
        item.answer.toLowerCase().includes(search.toLowerCase())
    );

    const openCreateDialog = () => {
        setEditingItem(null);
        setFormData({
            ...defaultFormData,
            sortOrder: (faqItems?.length ?? 0) + 1,
        });
        setEditDialogOpen(true);
    };

    const openEditDialog = (item: NonNullable<typeof faqItems>[0]) => {
        setEditingItem(item._id);
        setFormData({
            question: item.question,
            answer: item.answer,
            category: item.category,
            sortOrder: item.sortOrder,
            published: item.published,
        });
        setEditDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.question || !formData.answer) {
            toast.error("Question and answer are required");
            return;
        }

        try {
            if (editingItem) {
                await updateFAQ({
                    id: editingItem,
                    ...formData,
                });
                toast.success("FAQ updated successfully");
            } else {
                await createFAQ(formData);
                toast.success("FAQ created successfully");
            }
            setEditDialogOpen(false);
        } catch {
            toast.error("Failed to save FAQ");
        }
    };

    const handleDelete = async (id: Id<"faq">) => {
        try {
            await removeFAQ({ id });
            toast.success("FAQ deleted successfully");
        } catch {
            toast.error("Failed to delete FAQ");
        }
    };

    return (
        <main className="min-h-screen bg-background">


            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/admin"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-serif text-3xl font-bold">FAQ Management</h1>
                            <p className="text-muted-foreground">
                                {filteredItems?.length ?? 0} questions
                            </p>
                        </div>
                        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={openCreateDialog}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add FAQ
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingItem ? "Edit FAQ" : "Add New FAQ"}
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="question">Question *</Label>
                                        <Input
                                            id="question"
                                            value={formData.question}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, question: e.target.value }))
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="answer">Answer *</Label>
                                        <Textarea
                                            id="answer"
                                            value={formData.answer}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, answer: e.target.value }))
                                            }
                                            rows={5}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(value) =>
                                                setFormData((prev) => ({ ...prev, category: value }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categoryOptions.map((cat) => (
                                                    <SelectItem key={cat} value={cat}>
                                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sortOrder">Sort Order</Label>
                                        <Input
                                            id="sortOrder"
                                            type="number"
                                            value={formData.sortOrder}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    sortOrder: parseInt(e.target.value) || 0,
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Switch
                                            id="published"
                                            checked={formData.published}
                                            onCheckedChange={(checked) =>
                                                setFormData((prev) => ({ ...prev, published: checked }))
                                            }
                                        />
                                        <Label htmlFor="published">Published</Label>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button onClick={handleSubmit}>
                                        {editingItem ? "Update" : "Create"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-6 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search FAQs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* FAQ List */}
                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="rounded-xl border bg-card p-4 animate-pulse">
                                <div className="h-5 w-3/4 rounded bg-muted" />
                            </div>
                        ))}
                    </div>
                ) : filteredItems && filteredItems.length > 0 ? (
                    <div className="space-y-3">
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item._id}
                                initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-xl border bg-card overflow-hidden"
                            >
                                <div
                                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/20"
                                    onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium">{item.question}</h3>
                                            {!item.published && (
                                                <Badge variant="outline" className="text-xs">
                                                    Draft
                                                </Badge>
                                            )}
                                        </div>
                                        <Badge variant="secondary" className="text-xs capitalize mt-1">
                                            {item.category}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openEditDialog(item);
                                            }}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete FAQ?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently delete this FAQ. This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(item._id)}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        {expandedId === item._id ? (
                                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </div>
                                </div>

                                {expandedId === item._id && (
                                    <motion.div
                                        initial={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        className="px-4 pb-4 border-t bg-muted/10"
                                    >
                                        <p className="pt-4 text-muted-foreground whitespace-pre-wrap">
                                            {item.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 rounded-xl border bg-card">
                        <div className="mb-4 text-6xl">❓</div>
                        <h3 className="font-serif text-xl font-bold mb-2">No FAQs found</h3>
                        <p className="text-muted-foreground mb-6">
                            {search ? "Try a different search term" : "Start by adding your first FAQ"}
                        </p>
                        {!search && (
                            <Button onClick={openCreateDialog}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add First FAQ
                            </Button>
                        )}
                    </div>
                )}
            </div>


        </main>
    );
}
