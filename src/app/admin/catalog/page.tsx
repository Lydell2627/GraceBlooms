"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Plus, Pencil, Trash2, ArrowLeft, Eye, EyeOff, Search } from "lucide-react";
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
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { toast } from "sonner";

const categories = ["WEDDING", "BIRTHDAY", "ANNIVERSARY", "SYMPATHY", "CUSTOM"];
const tagOptions = ["featured", "new", "seasonal", "bestseller"];

interface CatalogFormData {
    title: string;
    slug: string;
    category: string;
    shortDescription: string;
    description: string;
    priceMin: number;
    priceMax: number;
    tags: string[];
    images: string[];
    customizationAvailable: boolean;
    leadTimeDays: number;
    deliveryNotes: string;
    published: boolean;
}

const defaultFormData: CatalogFormData = {
    title: "",
    slug: "",
    category: "WEDDING",
    shortDescription: "",
    description: "",
    priceMin: 0,
    priceMax: 0,
    tags: [],
    images: [],
    customizationAvailable: false,
    leadTimeDays: 1,
    deliveryNotes: "",
    published: true,
};

export default function AdminCatalogPage() {
    const prefersReducedMotion = useReducedMotion();
    const [search, setSearch] = React.useState("");
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState<Id<"catalogItems"> | null>(null);
    const [formData, setFormData] = React.useState<CatalogFormData>(defaultFormData);

    const catalogItems = useQuery(api.catalog.listAll, {});
    const createItem = useMutation(api.catalog.create);
    const updateItem = useMutation(api.catalog.update);
    const removeItem = useMutation(api.catalog.remove);

    const isLoading = catalogItems === undefined;

    const filteredItems = catalogItems?.filter(
        (item) =>
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.category.toLowerCase().includes(search.toLowerCase())
    );

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    };

    const openCreateDialog = () => {
        setEditingItem(null);
        setFormData(defaultFormData);
        setEditDialogOpen(true);
    };

    const openEditDialog = (item: NonNullable<typeof catalogItems>[0]) => {
        setEditingItem(item._id);
        setFormData({
            title: item.title,
            slug: item.slug,
            category: item.category,
            shortDescription: item.shortDescription,
            description: item.description,
            priceMin: item.priceMin,
            priceMax: item.priceMax,
            tags: item.tags,
            images: item.images,
            customizationAvailable: item.customizationAvailable ?? false,
            leadTimeDays: item.leadTimeDays ?? 1,
            deliveryNotes: item.deliveryNotes ?? "",
            published: item.published,
        });
        setEditDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.slug) {
            toast.error("Title and slug are required");
            return;
        }

        try {
            if (editingItem) {
                await updateItem({
                    id: editingItem,
                    ...formData,
                    currency: "INR",
                });
                toast.success("Item updated successfully");
            } else {
                await createItem({
                    ...formData,
                    currency: "INR",
                });
                toast.success("Item created successfully");
            }
            setEditDialogOpen(false);
        } catch {
            toast.error("Failed to save item");
        }
    };

    const handleDelete = async (id: Id<"catalogItems">) => {
        try {
            await removeItem({ id });
            toast.success("Item deleted successfully");
        } catch {
            toast.error("Failed to delete item");
        }
    };

    const toggleTag = (tag: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter((t) => t !== tag)
                : [...prev.tags, tag],
        }));
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
                            <h1 className="font-serif text-3xl font-bold">Catalog Management</h1>
                            <p className="text-muted-foreground">
                                {filteredItems?.length ?? 0} items
                            </p>
                        </div>
                        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={openCreateDialog}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Item
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingItem ? "Edit Item" : "Add New Item"}
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Title *</Label>
                                            <Input
                                                id="title"
                                                value={formData.title}
                                                onChange={(e) => {
                                                    const title = e.target.value;
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        title,
                                                        slug: prev.slug || generateSlug(title),
                                                    }));
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="slug">Slug *</Label>
                                            <Input
                                                id="slug"
                                                value={formData.slug}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                                                }
                                            />
                                        </div>
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
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat} value={cat}>
                                                        {cat.charAt(0) + cat.slice(1).toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="shortDesc">Short Description</Label>
                                        <Input
                                            id="shortDesc"
                                            value={formData.shortDescription}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    shortDescription: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Full Description</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }))
                                            }
                                            rows={4}
                                        />
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="priceMin">Min Price (₹)</Label>
                                            <Input
                                                id="priceMin"
                                                type="number"
                                                value={formData.priceMin}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        priceMin: parseInt(e.target.value) || 0,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="priceMax">Max Price (₹)</Label>
                                            <Input
                                                id="priceMax"
                                                type="number"
                                                value={formData.priceMax}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        priceMax: parseInt(e.target.value) || 0,
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Tags</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {tagOptions.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant={formData.tags.includes(tag) ? "default" : "outline"}
                                                    className="cursor-pointer capitalize"
                                                    onClick={() => toggleTag(tag)}
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="images">Image URLs (one per line)</Label>
                                        <Textarea
                                            id="images"
                                            value={formData.images.join("\n")}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    images: e.target.value.split("\n").filter(Boolean),
                                                }))
                                            }
                                            rows={3}
                                            placeholder="https://example.com/image1.jpg"
                                        />
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="leadTime">Lead Time (days)</Label>
                                            <Input
                                                id="leadTime"
                                                type="number"
                                                value={formData.leadTimeDays}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        leadTimeDays: parseInt(e.target.value) || 1,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 pt-8">
                                            <Switch
                                                id="customization"
                                                checked={formData.customizationAvailable}
                                                onCheckedChange={(checked) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        customizationAvailable: checked,
                                                    }))
                                                }
                                            />
                                            <Label htmlFor="customization">Customization Available</Label>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="deliveryNotes">Delivery Notes</Label>
                                        <Input
                                            id="deliveryNotes"
                                            value={formData.deliveryNotes}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    deliveryNotes: e.target.value,
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
                        placeholder="Search items..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Items List */}
                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="rounded-xl border bg-card p-4 animate-pulse">
                                <div className="flex gap-4">
                                    <div className="h-16 w-16 rounded-lg bg-muted" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-1/3 rounded bg-muted" />
                                        <div className="h-3 w-1/2 rounded bg-muted" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredItems && filteredItems.length > 0 ? (
                    <div className="space-y-4">
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item._id}
                                initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-4 rounded-xl border bg-card p-4 hover:shadow-sm transition-shadow"
                            >
                                {/* Image */}
                                <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
                                    {item.images[0] ? (
                                        <Image
                                            src={item.images[0]}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                                            No image
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium truncate">{item.title}</h3>
                                        {!item.published && (
                                            <Badge variant="outline" className="text-xs">
                                                Draft
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span className="capitalize">{item.category.toLowerCase()}</span>
                                        <span>•</span>
                                        <span>
                                            ₹{item.priceMin.toLocaleString()}
                                            {item.priceMin !== item.priceMax && `–₹${item.priceMax.toLocaleString()}`}
                                        </span>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="hidden md:flex gap-1">
                                    {item.tags.slice(0, 2).map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-xs capitalize">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => openEditDialog(item)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Item?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete &quot;{item.title}&quot;. This action cannot be undone.
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
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 rounded-xl border bg-card">
                        <div className="mb-4 text-6xl">🌸</div>
                        <h3 className="font-serif text-xl font-bold mb-2">No items found</h3>
                        <p className="text-muted-foreground mb-6">
                            {search ? "Try a different search term" : "Start by adding your first catalog item"}
                        </p>
                        {!search && (
                            <Button onClick={openCreateDialog}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add First Item
                            </Button>
                        )}
                    </div>
                )}
            </div>


        </main>
    );
}
