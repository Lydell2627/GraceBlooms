"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Plus, Pencil, Trash2, ArrowLeft, Search, GripVertical } from "lucide-react";
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
import { Switch } from "~/components/ui/switch";
import { toast } from "sonner";

const iconOptions = ["Heart", "Building2", "Palette", "CalendarDays", "Truck"];

interface ServiceFormData {
    title: string;
    description: string;
    icon: string;
    image: string;
    sortOrder: number;
    published: boolean;
}

const defaultFormData: ServiceFormData = {
    title: "",
    description: "",
    icon: "Heart",
    image: "",
    sortOrder: 0,
    published: true,
};

export default function AdminServicesPage() {
    const prefersReducedMotion = useReducedMotion();
    const [search, setSearch] = React.useState("");
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState<Id<"services"> | null>(null);
    const [formData, setFormData] = React.useState<ServiceFormData>(defaultFormData);

    const services = useQuery(api.services.listAll, {});
    const createService = useMutation(api.services.create);
    const updateService = useMutation(api.services.update);
    const removeService = useMutation(api.services.remove);

    const isLoading = services === undefined;

    const filteredServices = services?.filter((s) =>
        s.title.toLowerCase().includes(search.toLowerCase())
    );

    const openCreateDialog = () => {
        setEditingItem(null);
        setFormData({
            ...defaultFormData,
            sortOrder: (services?.length ?? 0) + 1,
        });
        setEditDialogOpen(true);
    };

    const openEditDialog = (service: NonNullable<typeof services>[0]) => {
        setEditingItem(service._id);
        setFormData({
            title: service.title,
            description: service.description,
            icon: service.icon || "Heart",
            image: service.image || "",
            sortOrder: service.sortOrder,
            published: service.published,
        });
        setEditDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.title) {
            toast.error("Title is required");
            return;
        }

        try {
            if (editingItem) {
                await updateService({
                    id: editingItem,
                    ...formData,
                });
                toast.success("Service updated successfully");
            } else {
                await createService(formData);
                toast.success("Service created successfully");
            }
            setEditDialogOpen(false);
        } catch {
            toast.error("Failed to save service");
        }
    };

    const handleDelete = async (id: Id<"services">) => {
        try {
            await removeService({ id });
            toast.success("Service deleted successfully");
        } catch {
            toast.error("Failed to delete service");
        }
    };

    return (
        <main className="min-h-screen bg-background">


            <div className="container mx-auto px-6 pt-28 pb-16">
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
                            <h1 className="font-serif text-3xl font-bold">Services Management</h1>
                            <p className="text-muted-foreground">
                                {filteredServices?.length ?? 0} services
                            </p>
                        </div>
                        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={openCreateDialog}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Service
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingItem ? "Edit Service" : "Add New Service"}
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title *</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, title: e.target.value }))
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
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

                                    <div className="space-y-2">
                                        <Label>Icon</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {iconOptions.map((icon) => (
                                                <Badge
                                                    key={icon}
                                                    variant={formData.icon === icon ? "default" : "outline"}
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        setFormData((prev) => ({ ...prev, icon }))
                                                    }
                                                >
                                                    {icon}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="image">Image URL</Label>
                                        <Input
                                            id="image"
                                            value={formData.image}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, image: e.target.value }))
                                            }
                                            placeholder="https://example.com/image.jpg"
                                        />
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
                        placeholder="Search services..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Services List */}
                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="rounded-xl border bg-card p-4 animate-pulse">
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-muted" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-1/3 rounded bg-muted" />
                                        <div className="h-3 w-1/2 rounded bg-muted" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredServices && filteredServices.length > 0 ? (
                    <div className="space-y-4">
                        {filteredServices.map((service) => (
                            <motion.div
                                key={service._id}
                                initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-4 rounded-xl border bg-card p-4 hover:shadow-sm transition-shadow"
                            >
                                <div className="text-muted-foreground">
                                    <GripVertical className="h-5 w-5" />
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                                    <span className="text-xs font-medium">{service.icon?.charAt(0) || "S"}</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium">{service.title}</h3>
                                        {!service.published && (
                                            <Badge variant="outline" className="text-xs">
                                                Draft
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {service.description}
                                    </p>
                                </div>

                                <div className="text-sm text-muted-foreground">
                                    Order: {service.sortOrder}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => openEditDialog(service)}
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
                                                <AlertDialogTitle>Delete Service?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete &quot;{service.title}&quot;. This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(service._id)}
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
                        <div className="mb-4 text-6xl">🛠️</div>
                        <h3 className="font-serif text-xl font-bold mb-2">No services found</h3>
                        <p className="text-muted-foreground mb-6">
                            {search ? "Try a different search term" : "Start by adding your first service"}
                        </p>
                        {!search && (
                            <Button onClick={openCreateDialog}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add First Service
                            </Button>
                        )}
                    </div>
                )}
            </div>


        </main>
    );
}
